const express = require("express");
const { getAnalyticsSummary } = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/summary", authMiddleware, roleMiddleware("admin"), getAnalyticsSummary);

module.exports = router;

