import CountUp from "react-countup";
import { theme } from "../utils/theme";

const StatsCards = ({ stats, loading = false }) => {
  const items = [
    { label: "Total Complaints", value: stats?.totalComplaints ?? 0 },
    { label: "Pending", value: stats?.pendingComplaints ?? 0 },
    { label: "Resolved", value: stats?.resolvedComplaints ?? 0 },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`${theme.card} transition hover:-translate-y-0.5 hover:shadow-2xl`}
        >
          <p className="text-sm text-slate-300">{item.label}</p>
          <p className="text-2xl font-bold">
            {loading ? "..." : <CountUp start={0} end={Number(item.value) || 0} duration={1.1} />}
          </p>
        </div>
      ))}
    </section>
  );
};

export default StatsCards;

