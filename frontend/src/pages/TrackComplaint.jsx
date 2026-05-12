import { useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import RatingStars from "../components/RatingStars";
import { theme } from "../utils/theme";

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState("");
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = complaintId.trim();
    if (!id) return;

    setLoading(true);
    setComplaint(null);
    try {
      // baseURL is http://localhost:5000/api → full URL is /api/complaints/:id
      const { data } = await axiosClient.get(`/complaints/${id}`);
      setComplaint(data.complaint);
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message;
      if (status === 400) {
        toast.error(msg || "Invalid ID format");
      } else if (status === 404) {
        toast.error(msg || "Complaint not found");
      } else if (!error.response) {
        toast.error("Cannot reach server. Is the backend running?");
      } else {
        toast.error(msg || "Failed to fetch complaint");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Track Complaint</h1>

      <form onSubmit={handleSubmit} className={theme.card}>
        <label className="mb-2 block text-sm font-medium text-slate-200">Enter Complaint ID</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter Complaint ID (example: 64f1a2b3c4d5e6f7a8b9c0d1)"
            className={theme.input}
          />
          <button
            type="submit"
            className={`${theme.buttonPrimary} sm:w-auto sm:px-6`}
            disabled={loading}
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </div>
      </form>

      {complaint && (
        <div className={theme.card}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-xl font-semibold">{complaint.title}</h2>
            <div className="flex items-center gap-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-700 p-4">
              <p className="text-sm text-slate-300">Department</p>
              <p className="font-medium">{complaint.department}</p>
            </div>
            <div className="rounded-xl border border-slate-700 p-4">
              <p className="text-sm text-slate-300">Created</p>
              <p className="font-medium">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-700 p-4 md:col-span-2">
              <p className="text-sm text-slate-300">Rating</p>
              <div className="mt-1">
                {complaint.rating === null ? (
                  <p className="text-slate-300">Not rated</p>
                ) : (
                  <RatingStars value={complaint.rating} readOnly />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;

