import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import StatsCards from "../components/StatsCards";
import { theme } from "../utils/theme";

const PublicDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    departmentWise: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get("/complaints/stats/public");
        setStats(data);
      } catch (error) {
        if (!error.response) {
          toast.error("Failed to fetch public stats. Is backend running on http://localhost:5000 ?");
          return;
        }
        toast.error(error.response?.data?.message || `Failed to fetch public stats (HTTP ${error.response.status})`);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Public Dashboard</h1>

      <StatsCards stats={stats} loading={loading} />

      <section className={theme.card}>
        <h2 className="mb-3 text-xl font-semibold">Department-wise Count</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {stats.departmentWise.map((item) => (
            <div key={item.department} className="rounded-xl border border-slate-700 bg-slate-900/30 p-4">
              <p className="font-medium">{item.department}</p>
              <p className="text-slate-300">{item.count} complaints</p>
            </div>
          ))}
          {stats.departmentWise.length === 0 && <p className="text-slate-300">No data available.</p>}
        </div>
      </section>
    </div>
  );
};

export default PublicDashboard;
