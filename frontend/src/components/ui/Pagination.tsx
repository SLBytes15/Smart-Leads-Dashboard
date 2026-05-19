import type { PaginationMeta } from "../../types";
import Button from "./Button";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
      <span>
        Showing {start}–{end} of {total} leads
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
        >
          ← Prev
        </Button>
        <span className="px-3 py-2 text-gray-700 font-medium">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
