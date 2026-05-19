import type { LeadStatus } from "../../types";

interface BadgeProps {
  status: LeadStatus;
}

// Each status gets its own color
const statusColors: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Qualified: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
};

const Badge = ({ status }: BadgeProps) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

export default Badge;
