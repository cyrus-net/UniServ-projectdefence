const Booking = require("../models/Booking");

// Process payment for a booking (simulated)
async function processPayment(req, res) {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the user is the client of this booking
    if (booking.client.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update payment status
    booking.paymentStatus = "paid";
    await booking.save();

    res.status(200).json({ message: "Payment successful", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { processPayment };
