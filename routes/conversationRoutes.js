const express = require("express");
const conversationRouter = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const {
  start,
  respond,
  sync,
  getHistory,
  goBack,
} = require("../controllers/flowController");

conversationRouter.use(auth);

// Start a conversation
conversationRouter.post("/start", start);

// Move forward by selecting an option
conversationRouter.post("/respond", respond);

// Deep link validation
conversationRouter.get("/sync", sync);

// Go back to the previous question
conversationRouter.post("/back", goBack);

// Get user journey
conversationRouter.get("/history", getHistory);

module.exports = conversationRouter;
