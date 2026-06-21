const express = require("express");
const router = express.Router();
const { auth, roleCheck } = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  getSellerRecentBookings,
} = require("../controllers/bookingController");

// Create booking (client only)
router.post("/", auth, roleCheck(["client"]), createBooking);

// Get bookings for client/seller
router.get("/", auth, getBookings);

// Update booking status (seller only)
router.put("/:id", auth, roleCheck(["seller"]), updateBookingStatus);

// Get recent bookings for seller
router.get("/seller/recent", auth, roleCheck(["seller"]), getSellerRecentBookings);

module.exports = router;
