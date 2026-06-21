const express = require("express");
const router = express.Router();
const { auth, roleCheck } = require("../middleware/authMiddleware");
const { processPayment } = require("../controllers/paymentController");

// Process payment for a booking (client only)
router.post("/", auth, roleCheck(["client"]), processPayment);

module.exports = router;
