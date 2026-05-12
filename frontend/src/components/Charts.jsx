import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Charts = ({ summary }) => {
  const departmentCounts = summary?.departmentCounts || {};
  const statusCounts = summary?.statusCounts || {};
  const priorityCounts = summary?.priorityCounts || {};

  const departmentLabels = Object.keys(departmentCounts);
  const departmentValues = Object.values(departmentCounts);

  const statusLabels = ["Pending", "In Progress", "Resolved", "Rejected"];
  const statusValues = statusLabels.map((k) => statusCounts[k] ?? 0);

  const priorityLabels = ["Low", "Medium", "High"];
  const priorityValues = priorityLabels.map((k) => priorityCounts[k] ?? 0);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="bg-slate-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-slate-700 lg:col-span-2">
        <h3 className="mb-3 text-lg font-semibold">Complaints by Department</h3>
        <Bar
          data={{
            labels: departmentLabels,
            datasets: [
              {
                label: "Complaints",
                data: departmentValues,
                backgroundColor: "rgba(16, 185, 129, 0.6)",
              },
            ],
          }}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-slate-700">
        <h3 className="mb-3 text-lg font-semibold">Status Distribution</h3>
        <Pie
          data={{
            labels: statusLabels,
            datasets: [
              {
                data: statusValues,
                backgroundColor: ["#fbbf24", "#60a5fa", "#34d399", "#fb7185"],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>

      <div className="bg-slate-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-slate-700">
        <h3 className="mb-3 text-lg font-semibold">Priority Distribution</h3>
        <Doughnut
          data={{
            labels: priorityLabels,
            datasets: [
              {
                data: priorityValues,
                backgroundColor: ["#a78bfa", "#22c55e", "#ef4444"],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default Charts;

