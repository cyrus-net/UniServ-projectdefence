const mongoose = require("mongoose");
const Service = require("../models/Service");
const Notification = require("../models/Notification");

// Create a new service (seller only)
async function createService(req, res) {
  try {
    const {
      title,
      description,
      category,
      price,
      availability,
      images,
      deliveryTime,
      revisions,
      features,
      requirements,
    } = req.body;

    const service = await Service.create({
      seller: req.userId,
      title,
      description,
      category,
      price,
      availability,
      images: Array.isArray(images) ? images : [],
      deliveryTime: deliveryTime ? Number(deliveryTime) : 1,
      revisions: revisions || "1",
      features: Array.isArray(features) ? features.filter((item) => !!item) : [],
      requirements: requirements || "",
    });

    await Notification.create({
      recipient: req.userId,
      type: "service",
      title: "New Service Listing",
      message: `Your service listing "${service.title}" is now live.`,
      read: false,
      metadata: { service: service._id },
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all services with pagination
async function getAllServices(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      Service.find()
        .populate("seller", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Service.countDocuments(),
    ]);

    res.json({
      services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get services by seller
async function getSellerServices(req, res) {
  try {
    const services = await Service.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get seller dashboard stats
async function getSellerStats(req, res) {
  try {
    const sellerId = mongoose.Types.ObjectId(req.userId);

    const [activeServices, totalBookings, earningsResult, avgRatingResult] = await Promise.all([
      Service.countDocuments({ seller: sellerId, $or: [{ status: { $exists: false } }, { status: { $ne: "Paused" } }] }),
      require("../models/Booking").countDocuments({ seller: sellerId }),
      require("../models/Booking").aggregate([
        { $match: { seller: sellerId, $or: [{ status: "completed" }, { paymentStatus: "paid" }] } },
        {
          $lookup: {
            from: "services",
            localField: "service",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: "$service" },
        { $group: { _id: null, total: { $sum: "$service.price" } } },
      ]),
      require("../models/Review").aggregate([
        { $match: { seller: sellerId } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } },
      ]),
    ]);

    res.json({
      activeServices,
      totalBookings,
      totalEarnings: earningsResult[0]?.total || 0,
      avgRating: avgRatingResult[0]?.avgRating ? parseFloat(avgRatingResult[0].avgRating.toFixed(1)) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update service (seller only)
async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { title, description, price, availability, status } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatePayload = {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(availability !== undefined ? { availability } : {}),
      ...(status !== undefined ? { status } : {}),
    };

    const updatedService = await Service.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    );

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete service (seller only)
async function deleteService(req, res) {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.seller.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Notification.create({
      recipient: req.userId,
      type: "service",
      title: "Service Deleted",
      message: `Your service "${service.title}" was deleted successfully.`,
      read: false,
      metadata: { service: service._id },
    });

    await Service.findByIdAndDelete(id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createService,
  getAllServices,
  getSellerServices,
  getSellerStats,
  updateService,
  deleteService,
};
