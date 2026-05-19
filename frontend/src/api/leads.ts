import api from "./axios";
import type { Lead, PaginationMeta, LeadFilters } from "../types";

interface LeadsResponse {
  leads: Lead[];
  pagination: PaginationMeta;
}

export const getLeads = async (
  filters: Partial<LeadFilters>,
): Promise<LeadsResponse> => {
  const res = await api.get("/leads", { params: filters });
  return res.data.data;
};

export const getLeadById = async (id: string): Promise<Lead> => {
  const res = await api.get(`/leads/${id}`);
  return res.data.data;
};

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  const res = await api.post("/leads", data);
  return res.data.data;
};

export const updateLead = async (
  id: string,
  data: Partial<Lead>,
): Promise<Lead> => {
  const res = await api.put(`/leads/${id}`, data);
  return res.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsCSV = async (
  filters: Partial<LeadFilters>,
): Promise<void> => {
  const res = await api.get("/leads/export", {
    params: filters,
    responseType: "blob", // important for file downloads
  });

  // Create a temporary link and click it to trigger download
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "leads.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
