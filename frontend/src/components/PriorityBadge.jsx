const priorityToClass = {
  High: "bg-red-600 text-white",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-green-600 text-white",
};

const PriorityBadge = ({ priority }) => {
  const cls = priorityToClass[priority] || "bg-slate-600 text-white";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{priority}</span>
  );
};

export default PriorityBadge;

