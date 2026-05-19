import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads, exportLeadsCSV } from "../api/leads";
import { useAuth } from "../context/AuthContext";
import type { Lead, PaginationMeta, LeadFilters } from "../types";
import useDebounce from "../hooks/useDebounce";
import LeadsTable from "../components/leads/LeadsTable";
import LeadModal from "../components/leads/LeadModal";
import DeleteModal from "../components/leads/DeleteModal";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [source, setSource] = useState("all");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);

  // Debounce search — only fires API call 500ms after user stops typing
  const debouncedSearch = useDebounce(search, 500);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

  // Fetch leads whenever filters change
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filters: Partial<LeadFilters> = {
        search: debouncedSearch,
        status,
        source,
        sort,
        page,
      };
      const data = await getLeads(filters);
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch {
      setError("Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, source, sort, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportLeadsCSV({ search: debouncedSearch, status, source, sort });
    } catch {
      alert("Export failed. Try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Smart Leads</h1>
          <p className="text-xs text-gray-400">
            {user?.name} · <span className="capitalize">{user?.role}</span>
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Leads
            {pagination && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({pagination.total} total)
              </span>
            )}
          </h2>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              loading={exporting}
            >
              ⬇ Export CSV
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>+ Add Lead</Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Source Filter */}
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "latest" | "oldest")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {/* Error State */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-16 text-gray-400">
              <svg
                className="animate-spin h-6 w-6 mr-3"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Loading leads...
            </div>
          ) : (
            <>
              <LeadsTable
                leads={leads}
                onEdit={(lead) => setEditLead(lead)}
                onDelete={(lead) => setDeleteLead(lead)}
              />
              {pagination && pagination.totalPages > 1 && (
                <Pagination pagination={pagination} onPageChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <LeadModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchLeads}
        />
      )}
      {editLead && (
        <LeadModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSuccess={fetchLeads}
        />
      )}
      {deleteLead && (
        <DeleteModal
          leadId={deleteLead._id}
          leadName={deleteLead.name}
          onClose={() => setDeleteLead(null)}
          onSuccess={fetchLeads}
        />
      )}
    </div>
  );
};

export default DashboardPage;
