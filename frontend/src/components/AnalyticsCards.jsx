const AnalyticsCards = ({ summary, loading }) => {
  const total = summary?.totalComplaints ?? 0;
  const statusCounts = summary?.statusCounts || {};

  const items = [
    { label: "Total", value: total },
    { label: "Pending", value: statusCounts.Pending ?? 0 },
    { label: "Resolved", value: statusCounts.Resolved ?? 0 },
    { label: "Rejected", value: statusCounts.Rejected ?? 0 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-slate-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-slate-700">
          <p className="text-sm text-slate-300">{item.label}</p>
          <p className="text-2xl font-bold">{loading ? "..." : item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;

