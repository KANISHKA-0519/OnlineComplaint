const statusToClass = {
  Pending: "bg-yellow-500 text-black",
  "In Progress": "bg-blue-500 text-white",
  Resolved: "bg-green-500 text-white",
  Rejected: "bg-red-500 text-white",
};

const StatusBadge = ({ status }) => {
  const cls = statusToClass[status] || "bg-slate-600 text-white";
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
};

export default StatusBadge;

