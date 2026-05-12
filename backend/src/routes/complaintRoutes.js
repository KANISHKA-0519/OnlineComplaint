const express = require("express");
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
  rateComplaint,
  assignComplaint,
  getPublicStats,
  getAdmins,
  trackComplaintById,
  getComplaintPublicById,
} = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/stats/public", getPublicStats);
router.get("/track/:id", trackComplaintById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("citizen"),
  upload.single("evidence"),
  createComplaint
);
router.get("/user", authMiddleware, roleMiddleware("citizen"), getUserComplaints);
router.put("/:id/rate", authMiddleware, roleMiddleware("citizen"), rateComplaint);

router.get("/", authMiddleware, roleMiddleware("admin"), getAllComplaints);
router.get("/admins", authMiddleware, roleMiddleware("admin"), getAdmins);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateComplaintStatus);
router.put("/:id/assign", authMiddleware, roleMiddleware("admin"), assignComplaint);

// Must be last among GET routes — otherwise "/user", "/admins" match as :id
router.get("/:id", getComplaintPublicById);

module.exports = router;
