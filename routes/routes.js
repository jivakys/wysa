const express = require("express");
const router = express.Router();
const {
  start,
  respond,
  sync,
  getHistory,
} = require("../controllers/flowController");

// Start a conversation
router.post("/start", start);

// Move forward by selecting an option
router.post("/respond", respond);

// Deep link validation
router.get("/sync", sync);

// Get user journey
router.get("/history/:userId", getHistory);

module.exports = router;
