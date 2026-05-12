import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { departments, priorities, statuses } from "../utils/constants";
import AnalyticsCards from "../components/AnalyticsCards";
import Charts from "../components/Charts";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import MapViewModal from "../components/MapViewModal";
import { theme } from "../utils/theme";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: null, lng: null, title: "" });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    department: "",
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  }, [filters]);

  const fetchComplaints = async () => {
    try {
      const { data } = await axiosClient.get(`/complaints${queryString ? `?${queryString}` : ""}`);
      setComplaints(data.complaints);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch complaints");
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data } = await axiosClient.get("/complaints/admins");
      setAdmins(data.admins);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch admins");
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const { data } = await axiosClient.get("/analytics/summary");
      setAnalyticsSummary(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [queryString]);

  const updateStatus = async (complaintId, status) => {
    try {
      await axiosClient.put(`/complaints/${complaintId}/status`, { status });
      toast.success("Status updated");
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const assignComplaint = async (complaintId, assignedTo) => {
    try {
      await axiosClient.put(`/complaints/${complaintId}/assign`, { assignedTo });
      toast.success("Complaint assigned");
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign complaint");
    }
  };

  return (
    <div className="space-y-6">
      <ComplaintDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        complaint={selectedComplaint}
      />

      <MapViewModal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        lat={mapCoords.lat}
        lng={mapCoords.lng}
        title={mapCoords.title || "Complaint Location"}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Analytics</h2>
          <button
            type="button"
            onClick={fetchAnalytics}
            className={`${theme.buttonSecondary} text-sm`}
          >
            Refresh
          </button>
        </div>

        <AnalyticsCards summary={analyticsSummary} loading={analyticsLoading} />

        <div className={`${theme.card} p-5`}>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded border border-slate-700 p-4">
              <p className="text-sm text-slate-300">Average Resolution Time</p>
              <p className="text-lg font-semibold">
                {analyticsLoading
                  ? "..."
                  : analyticsSummary?.avgResolutionTimeMs
                    ? `${Math.round(analyticsSummary.avgResolutionTimeMs / 60000)} mins`
                    : "N/A"}
              </p>
            </div>
            <div className="rounded border border-slate-700 p-4 md:col-span-2">
              <p className="text-sm text-slate-300">Top Problem Department</p>
              <p className="text-lg font-semibold">
                {analyticsLoading
                  ? "..."
                  : analyticsSummary?.topProblemDepartment
                    ? `${analyticsSummary.topProblemDepartment.department} (${analyticsSummary.topProblemDepartment.count})`
                    : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <Charts summary={analyticsSummary} />
      </section>

      <section className={theme.card}>
        <h2 className="mb-4 text-xl font-semibold">Filters</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            placeholder="Search title"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className={theme.input}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className={theme.input}
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
            className={theme.input}
          >
            <option value="">All Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <select
            value={filters.department}
            onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
            className={theme.input}
          >
            <option value="">All Department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={theme.card}>
        <h2 className="mb-4 text-xl font-semibold">All Complaints</h2>
        <div className="overflow-x-auto">
          <table className={`${theme.table} text-sm`}>
            <thead className={theme.tableHead}>
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Citizen</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Department</th>
                <th className="p-2">View</th>
                <th className="p-2">Location</th>
                <th className="p-2">Assign</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint._id} className={theme.tableRow}>
                  <td className="p-2">{complaint.title}</td>
                  <td className="p-2">{complaint.createdBy?.name || "-"}</td>
                  <td className="p-2">
                    <select
                      value={complaint.status}
                      onChange={(e) => updateStatus(complaint._id, e.target.value)}
                      className="rounded-lg bg-slate-700 text-white border border-slate-600 p-1"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1">
                      <StatusBadge status={complaint.status} />
                    </div>
                  </td>
                  <td className="p-2">
                    <PriorityBadge priority={complaint.priority} />
                  </td>
                  <td className="p-2">{complaint.department}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold px-3 py-1 rounded-lg hover:opacity-90 transition text-xs"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setDetailsOpen(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td className="p-2">
                    {complaint.location?.lat != null && complaint.location?.lng != null ? (
                      <button
                        type="button"
                        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold px-3 py-1 rounded-lg hover:opacity-90 transition text-xs"
                        onClick={() => {
                          setMapCoords({
                            lat: Number(complaint.location.lat),
                            lng: Number(complaint.location.lng),
                            title: complaint.title,
                          });
                          setMapModalOpen(true);
                        }}
                      >
                        View Location
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300">N/A</span>
                    )}
                  </td>
                  <td className="p-2">
                    <select
                      value={complaint.assignedTo?._id || ""}
                      onChange={(e) => assignComplaint(complaint._id, e.target.value)}
                      className="rounded-lg bg-slate-700 text-white border border-slate-600 p-1"
                    >
                      <option value="">Unassigned</option>
                      {admins.map((admin) => (
                        <option key={admin._id} value={admin._id}>
                          {admin.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">{new Date(complaint.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr className={theme.tableRow}>
                  <td className="p-2 text-slate-300" colSpan={9}>
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

export default AdminDashboard;
