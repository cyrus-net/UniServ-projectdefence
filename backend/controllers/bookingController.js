const Booking = require("../models/Booking");
const Service = require("../models/Service");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Create a booking (client only)
async function createBooking(req, res) {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      client: req.userId,
      seller: service.seller,
      service: serviceId,
      status: "pending",
    });

    const client = await User.findById(req.userId);
    await Notification.create({
      recipient: service.seller,
      type: "booking",
      title: "New Booking Received",
      message: `${client?.fullName || "A client"} booked your ${service.title} service.`,
      read: false,
      metadata: { booking: booking._id, service: service._id },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get bookings for client or seller
async function getBookings(req, res) {
  try {
    const bookings = await Booking.find({
      $or: [{ client: req.userId }, { seller: req.userId }],
    })
      .populate("client", "fullName email")
      .populate("seller", "fullName email")
      .populate("service", "title description price");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get 3 most recent bookings for seller
async function getSellerRecentBookings(req, res) {
  try {
    const bookings = await Booking.find({ seller: req.userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("client", "fullName email")
      .populate("service", "title price");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update booking status (seller only)
async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "completed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("client", "fullName email")
      .populate("seller", "fullName email")
      .populate("service", "title description price");

    if (status === "completed" && updatedBooking) {
      await Notification.create({
        recipient: updatedBooking.client._id,
        type: "booking",
        title: "Order Completed",
        message: `Your booking for ${updatedBooking.service.title} has been completed.`,
        read: false,
        metadata: { booking: updatedBooking._id, service: updatedBooking.service._id },
      });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createBooking,
  getBookings,
  getSellerRecentBookings,
  updateBookingStatus,
};
