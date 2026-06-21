const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    deliveryTime: {
      type: Number,
      default: 1,
    },
    revisions: {
      type: String,
      default: "1",
    },
    features: {
      type: [String],
      default: [],
    },
    requirements: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Paused"],
      default: "Active",
      index: true,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);
