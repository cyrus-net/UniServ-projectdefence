const Review = require("../models/Review");
const Service = require("../models/Service");
const User = require("../models/User");
const Notification = require("../models/Notification");

async function createReview(req, res) {
  try {
    const { serviceId, rating, comment } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const client = await User.findById(req.userId);
    const seller = await User.findById(service.seller);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const review = await Review.create({
      client: req.userId,
      seller: service.seller,
      service: serviceId,
      rating,
      comment,
    });

    await Notification.create({
      recipient: service.seller,
      type: "review",
      title: "New Review",
      message: `${client?.fullName || "A client"} left a ${rating}-star review for ${service.title}.`,
      read: false,
      metadata: { review: review._id, service: service._id },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await Review.find({
      $or: [{ client: req.userId }, { seller: req.userId }],
    })
      .populate("client", "fullName email")
      .populate("seller", "fullName email")
      .populate("service", "title price");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createReview,
  getReviews,
};
