const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessages,
  getConversation,
} = require("../controllers/messageController");

// Send a message
router.post("/", auth, sendMessage);

// Get all messages for the current user
router.get("/", auth, getMessages);

// Get conversation with a specific user
router.get("/:userId", auth, getConversation);

module.exports = router;
