"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeads = exports.deleteLead = exports.updateLead = exports.getLeadById = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const apiResponse_1 = require("../utils/apiResponse");
const csvExport_1 = require("../utils/csvExport");
// ─── CREATE LEAD ─────────────────────────────────────────
const createLead = async (req, res) => {
    try {
        const { name, email, status, source } = req.body;
        // Basic validation
        if (!name || !email || !source) {
            (0, apiResponse_1.sendError)(res, "Name, email and source are required", 400);
            return;
        }
        const lead = await Lead_1.default.create({
            name,
            email,
            status: status || "New",
            source,
            createdBy: req.user?.id, // attach the logged-in user's ID
        });
        (0, apiResponse_1.sendSuccess)(res, lead, "Lead created successfully", 201);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Failed to create lead", 500);
    }
};
exports.createLead = createLead;
// ─── GET ALL LEADS (with filter, search, sort, pagination) ───
const getLeads = async (req, res) => {
    try {
        const { status, source, search, sort = "latest", page = "1", limit = "10", } = req.query;
        // Build the filter object dynamically
        const filter = {};
        // Admins see all leads, sales users see only their own
        if (req.user?.role !== "admin") {
            filter.createdBy = req.user?.id;
        }
        // Filter by status if provided
        if (status && status !== "all") {
            filter.status = status;
        }
        // Filter by source if provided
        if (source && source !== "all") {
            filter.source = source;
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
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Run both queries in parallel for performance
        const [leads, total] = await Promise.all([
            Lead_1.default.find(filter)
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limitNum)
                .populate("createdBy", "name email"), // show who created the lead
            Lead_1.default.countDocuments(filter),
        ]);
        (0, apiResponse_1.sendSuccess)(res, {
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
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Failed to fetch leads", 500);
    }
};
exports.getLeads = getLeads;
// ─── GET SINGLE LEAD ────────────────────────────────────
const getLeadById = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id).populate("createdBy", "name email");
        if (!lead) {
            (0, apiResponse_1.sendError)(res, "Lead not found", 404);
            return;
        }
        // Sales users can only view their own leads
        if (req.user?.role !== "admin" &&
            lead.createdBy.toString() !== req.user?.id) {
            (0, apiResponse_1.sendError)(res, "Access denied", 403);
            return;
        }
        (0, apiResponse_1.sendSuccess)(res, lead);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Failed to fetch lead", 500);
    }
};
exports.getLeadById = getLeadById;
// ─── UPDATE LEAD ────────────────────────────────────────
const updateLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (!lead) {
            (0, apiResponse_1.sendError)(res, "Lead not found", 404);
            return;
        }
        // Sales users can only update their own leads
        if (req.user?.role !== "admin" &&
            lead.createdBy.toString() !== req.user?.id) {
            (0, apiResponse_1.sendError)(res, "Access denied. You can only update your own leads.", 403);
            return;
        }
        const { name, email, status, source } = req.body;
        const updatedLead = await Lead_1.default.findByIdAndUpdate(req.params.id, { name, email, status, source }, { new: true, runValidators: true });
        (0, apiResponse_1.sendSuccess)(res, updatedLead, "Lead updated successfully");
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Failed to update lead", 500);
    }
};
exports.updateLead = updateLead;
// ─── DELETE LEAD ────────────────────────────────────────
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (!lead) {
            (0, apiResponse_1.sendError)(res, "Lead not found", 404);
            return;
        }
        // Only admins can delete leads
        if (req.user?.role !== "admin") {
            (0, apiResponse_1.sendError)(res, "Access denied. Only admins can delete leads.", 403);
            return;
        }
        await lead.deleteOne();
        (0, apiResponse_1.sendSuccess)(res, null, "Lead deleted successfully");
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Failed to delete lead", 500);
    }
};
exports.deleteLead = deleteLead;
const exportLeads = async (req, res) => {
    try {
        const { status, source, search } = req.query;
        // Same filter logic as getLeads
        const filter = {};
        if (req.user?.role !== "admin") {
            filter.createdBy = req.user?.id;
        }
        if (status && status !== "all") {
            filter.status = status;
        }
        if (source && source !== "all") {
            filter.source = source;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const leads = await Lead_1.default.find(filter).sort({ createdAt: -1 });
        if (leads.length === 0) {
            (0, apiResponse_1.sendError)(res, "No leads found to export", 404);
            return;
        }
        // Generate CSV string
        const csv = (0, csvExport_1.generateCSV)(leads);
        // Set headers to trigger file download in browser
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
        res.status(200).send(csv);
    }
    catch (error) {
        (0, apiResponse_1.sendError)(res, "Failed to export leads", 500);
    }
};
exports.exportLeads = exportLeads;
