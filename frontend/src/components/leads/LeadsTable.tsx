import type { Lead } from "../../types";
import Badge from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

const LeadsTable = ({ leads, onEdit, onDelete }: LeadsTableProps) => {
  const { user } = useAuth();

  // Empty state
  if (leads.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium">No leads found</p>
        <p className="text-sm mt-1">
          Try changing your filters or add a new lead
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase tracking-wider">
            <th className="pb-3 pr-4 font-medium">Name</th>
            <th className="pb-3 pr-4 font-medium">Email</th>
            <th className="pb-3 pr-4 font-medium">Status</th>
            <th className="pb-3 pr-4 font-medium">Source</th>
            <th className="pb-3 pr-4 font-medium">Created</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 transition">
              <td className="py-3 pr-4 font-medium text-gray-900">
                {lead.name}
              </td>
              <td className="py-3 pr-4 text-gray-500">{lead.email}</td>
              <td className="py-3 pr-4">
                <Badge status={lead.status} />
              </td>
              <td className="py-3 pr-4 text-gray-500">{lead.source}</td>
              <td className="py-3 pr-4 text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(lead)}
                    className="text-blue-600 hover:underline text-xs font-medium"
                  >
                    Edit
                  </button>
                  {/* Only admins see delete button */}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="text-red-500 hover:underline text-xs font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
