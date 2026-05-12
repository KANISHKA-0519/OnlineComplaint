import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { departments, priorities } from "../utils/constants";
import RatingStars from "../components/RatingStars";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import LocationInput from "../components/LocationInput";
import { theme } from "../utils/theme";

const CitizenDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "Water",
    priority: "Medium",
  });
  const [evidence, setEvidence] = useState(null);
  const [location, setLocation] = useState({ lat: "", lng: "" });

  const fetchComplaints = async () => {
    try {
      const { data } = await axiosClient.get("/complaints/user");
      setComplaints(data.complaints);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const rateComplaint = async (complaintId, ratingValue) => {
    const previousComplaints = complaints;
    setComplaints((prev) =>
      prev.map((c) => (c._id === complaintId ? { ...c, rating: ratingValue } : c))
    );

    try {
      await axiosClient.put(`/complaints/${complaintId}/rate`, { rating: ratingValue });
      toast.success("Thanks for rating!");
      fetchComplaints();
    } catch (error) {
      setComplaints(previousComplaints);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const latStr = (location?.lat ?? "").trim();
    const lngStr = (location?.lng ?? "").trim();
    const hasAny = Boolean(latStr) || Boolean(lngStr);
    const hasBoth = Boolean(latStr) && Boolean(lngStr);

    if (hasAny && !hasBoth) {
      toast.error("Please provide both Latitude and Longitude");
      return;
    }

    if (hasBoth) {
      const latNum = Number(latStr);
      const lngNum = Number(lngStr);
      const latValid = Number.isFinite(latNum) && latNum >= -90 && latNum <= 90;
      const lngValid = Number.isFinite(lngNum) && lngNum >= -180 && lngNum <= 180;

      if (!latValid || !lngValid) {
        toast.error("Invalid coordinates. Latitude: -90..90, Longitude: -180..180");
        return;
      }
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    if (evidence) payload.append("evidence", evidence);
    if (hasBoth) {
      payload.append("lat", latStr);
      payload.append("lng", lngStr);
    }

    try {
      await axiosClient.post("/complaints", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Complaint submitted");
      setFormData({ title: "", description: "", department: "Water", priority: "Medium" });
      setEvidence(null);
      setLocation({ lat: "", lng: "" });
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    }
  };

  return (
    <div className="space-y-6">
      <section className={theme.card}>
        <h2 className="mb-4 text-xl font-semibold">Create Complaint</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            placeholder="Complaint title"
            value={formData.title}
            onChange={handleChange}
            className={`${theme.input} md:col-span-2`}
            required
          />
          <textarea
            name="description"
            placeholder="Detailed description"
            value={formData.description}
            onChange={handleChange}
            className={`${theme.input} md:col-span-2`}
            rows={4}
            required
          />
          <select name="department" value={formData.department} onChange={handleChange} className={theme.input}>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select name="priority" value={formData.priority} onChange={handleChange} className={theme.input}>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={(e) => setEvidence(e.target.files?.[0] || null)}
            className={`${theme.input} md:col-span-2`}
          />
          <div className="md:col-span-2">
            <LocationInput value={location} onChange={setLocation} />
          </div>
          <button className={`${theme.buttonPrimary} md:col-span-2`}>
            Submit Complaint
          </button>
        </form>
      </section>

      <section className={theme.card}>
        <h2 className="mb-4 text-xl font-semibold">Complaint History</h2>
        <div className="overflow-x-auto">
          <table className={`${theme.table} text-sm`}>
            <thead className={theme.tableHead}>
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Department</th>
                <th className="p-2">Created</th>
                <th className="p-2">Updated</th>
                <th className="p-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className={theme.tableRow}>
                  <td className="p-2">{complaint.title}</td>
                  <td className="p-2">
                    <StatusBadge status={complaint.status} />
                  </td>
                  <td className="p-2">
                    <PriorityBadge priority={complaint.priority} />
                  </td>
                  <td className="p-2">{complaint.department}</td>
                  <td className="p-2">{new Date(complaint.createdAt).toLocaleString()}</td>
                  <td className="p-2">{new Date(complaint.updatedAt).toLocaleString()}</td>
                  <td className="p-2">
                    {complaint.status === "Resolved" && complaint.rating === null ? (
                      <RatingStars value={0} onChange={(val) => rateComplaint(complaint._id, val)} />
                    ) : (
                      <RatingStars value={complaint.rating || 0} readOnly />
                    )}
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr className={theme.tableRow}>
                  <td className="p-2 text-slate-300" colSpan={7}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CitizenDashboard;
