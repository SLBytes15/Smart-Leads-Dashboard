import Button from "../ui/Button";
import { useState } from "react";
import { deleteLead } from "../../api/leads";

interface DeleteModalProps {
  leadId: string;
  leadName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteModal = ({
  leadId,
  leadName,
  onClose,
  onSuccess,
}: DeleteModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteLead(leadId);
      onSuccess();
      onClose();
    } catch {
      alert("Failed to delete lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Lead
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-800">{leadName}</span>? This
          action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={loading}
            onClick={handleDelete}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
