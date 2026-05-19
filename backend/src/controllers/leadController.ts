import { Response } from "express";
import Lead from "../models/Lead";
import { AuthRequest } from "../middleware/authMiddleware";
import { sendSuccess, sendError } from "../utils/apiResponse";
import { LeadStatus, LeadSource } from "../types";

// ─── CREATE LEAD ─────────────────────────────────────────
export const createLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    // Basic validation
    if (!name || !email || !source) {
      sendError(res, "Name, email and source are required", 400);
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || "New",
      source,
      createdBy: req.user?.id, // attach the logged-in user's ID
    });

    sendSuccess(res, lead, "Lead created successfully", 201);
  } catch (error) {
    sendError(res, "Failed to create lead", 500);
  }
};

// ─── GET ALL LEADS (with filter, search, sort, pagination) ───
export const getLeads = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = "latest",
      page = "1",
      limit = "10",
    } = req.query;

    // Build the filter object dynamically
    const filter: Record<string, unknown> = {};

    // Admins see all leads, sales users see only their own
    if (req.user?.role !== "admin") {
      filter.createdBy = req.user?.id;
    }

    // Filter by status if provided
    if (status && status !== "all") {
      filter.status = status as LeadStatus;
    }

    // Filter by source if provided
    if (source && source !== "all") {
      filter.source = source as LeadSource;
    }

    // Search by name or email (case-insensitive)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Sort: latest = newest first, oldest = oldest first
    const sortOrder = sort === "oldest" ? 1 : -1;

    // Pagination math
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Run both queries in parallel for performance
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .populate("createdBy", "name email"), // show who created the lead
      Lead.countDocuments(filter),
    ]);

    sendSuccess(res, {
      leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    sendError(res, "Failed to fetch leads", 500);
  }
};

// ─── GET SINGLE LEAD ────────────────────────────────────
export const getLeadById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!lead) {
      sendError(res, "Lead not found", 404);
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user?.role !== "admin" &&
      lead.createdBy.toString() !== req.user?.id
    ) {
      sendError(res, "Access denied", 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    sendError(res, "Failed to fetch lead", 500);
  }
};

// ─── UPDATE LEAD ────────────────────────────────────────
export const updateLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, "Lead not found", 404);
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user?.role !== "admin" &&
      lead.createdBy.toString() !== req.user?.id
    ) {
      sendError(res, "Access denied. You can only update your own leads.", 403);
      return;
    }

    const { name, email, status, source } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, status, source },
      { new: true, runValidators: true }, // return updated doc, run schema validators
    );

    sendSuccess(res, updatedLead, "Lead updated successfully");
  } catch (error) {
    sendError(res, "Failed to update lead", 500);
  }
};

// ─── DELETE LEAD ────────────────────────────────────────
export const deleteLead = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, "Lead not found", 404);
      return;
    }

    // Only admins can delete leads
    if (req.user?.role !== "admin") {
      sendError(res, "Access denied. Only admins can delete leads.", 403);
      return;
    }

    await lead.deleteOne();

    sendSuccess(res, null, "Lead deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete lead", 500);
  }
};
