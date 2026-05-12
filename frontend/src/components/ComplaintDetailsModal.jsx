import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { theme } from "../utils/theme";

const ComplaintDetailsModal = ({ open, onClose, complaint }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg max-w-lg w-full border border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{complaint?.title || "Complaint Details"}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {complaint?.status ? <StatusBadge status={complaint.status} /> : null}
              {complaint?.priority ? <PriorityBadge priority={complaint.priority} /> : null}
              {complaint?.department ? (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-600 text-white">
                  {complaint.department}
                </span>
              ) : null}
            </div>
          </div>

          <button type="button" onClick={onClose} className={theme.buttonSecondary}>
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-sm text-slate-300">Created</p>
            <p className="font-medium">
              {complaint?.createdAt ? new Date(complaint.createdAt).toLocaleString() : "-"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-sm text-slate-300">Description</p>
            <div className="mt-2 max-h-52 overflow-y-auto pr-2 text-slate-100 whitespace-pre-wrap">
              {complaint?.description || "-"}
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-900/30 p-4">
            <p className="text-sm text-slate-300">Uploaded Evidence</p>
            {complaint?.evidence ? (
              <img
                src={`http://localhost:5000/${complaint.evidence}`}
                alt="Complaint evidence"
                className="rounded-lg mt-2 max-h-64 w-full object-contain border border-slate-700"
              />
            ) : (
              <p className="mt-2 text-slate-300">No image uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;

