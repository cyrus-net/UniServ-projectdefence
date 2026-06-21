const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markNotificationRead);
router.patch("/read-all", auth, markAllNotificationsRead);

module.exports = router;
