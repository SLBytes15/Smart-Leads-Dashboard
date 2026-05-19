import { useState, useEffect } from "react";
import type { Lead, LeadStatus, LeadSource } from "../../types";
import { createLead, updateLead } from "../../api/leads";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface LeadModalProps {
  lead?: Lead | null; // if provided = edit mode, else = create mode
  onClose: () => void;
  onSuccess: () => void; // refresh leads list after save
}

interface FormErrors {
  name?: string;
  email?: string;
  source?: string;
}

const STATUSES: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const SOURCES: LeadSource[] = ["Website", "Instagram", "Referral"];

const LeadModal = ({ lead, onClose, onSuccess }: LeadModalProps) => {
  const isEdit = !!lead;

  const [name, setName] = useState(lead?.name || "");
  const [email, setEmail] = useState(lead?.email || "");
  const [status, setStatus] = useState<LeadStatus>(lead?.status || "New");
  const [source, setSource] = useState<LeadSource>(lead?.source || "Website");
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form if lead prop changes
  useEffect(() => {
    setName(lead?.name || "");
    setEmail(lead?.email || "");
    setStatus(lead?.status || "New");
    setSource(lead?.source || "Website");
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email";
    if (!source) newErrors.source = "Source is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEdit && lead) {
        await updateLead(lead._id, { name, email, status, source });
      } else {
        await createLead({ name, email, status, source });
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          {/* Status Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as LeadSource)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.source && (
              <p className="text-xs text-red-500">{errors.source}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {isEdit ? "Save Changes" : "Add Lead"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
