const Complaint = require("../models/Complaint");

const getAnalyticsSummary = async (_req, res) => {
  try {
    const [result] = await Complaint.aggregate([
      {
        $facet: {
          totals: [{ $count: "total" }],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          priorityCounts: [{ $group: { _id: "$priority", count: { $sum: 1 } } }],
          departmentCounts: [{ $group: { _id: "$department", count: { $sum: 1 } } }],
          avgResolutionMs: [
            { $match: { status: "Resolved", resolvedAt: { $ne: null } } },
            {
              $project: {
                resolutionMs: { $subtract: ["$resolvedAt", "$createdAt"] },
              },
            },
            { $group: { _id: null, avgMs: { $avg: "$resolutionMs" } } },
          ],
        },
      },
    ]);

    const toMap = (arr) =>
      (arr || []).reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

    const totalComplaints = result?.totals?.[0]?.total || 0;
    const statusCounts = toMap(result?.statusCounts);
    const priorityCounts = toMap(result?.priorityCounts);
    const departmentCounts = toMap(result?.departmentCounts);

    let topProblemDepartment = null;
    for (const [department, count] of Object.entries(departmentCounts)) {
      if (!topProblemDepartment || count > topProblemDepartment.count) {
        topProblemDepartment = { department, count };
      }
    }

    const avgResolutionTimeMs = result?.avgResolutionMs?.[0]?.avgMs || null;

    return res.status(200).json({
      totalComplaints,
      statusCounts: {
        Pending: statusCounts.Pending || 0,
        "In Progress": statusCounts["In Progress"] || 0,
        Resolved: statusCounts.Resolved || 0,
        Rejected: statusCounts.Rejected || 0,
      },
      priorityCounts: {
        Low: priorityCounts.Low || 0,
        Medium: priorityCounts.Medium || 0,
        High: priorityCounts.High || 0,
      },
      departmentCounts,
      avgResolutionTimeMs,
      topProblemDepartment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch analytics summary", error: error.message });
  }
};

module.exports = { getAnalyticsSummary };

