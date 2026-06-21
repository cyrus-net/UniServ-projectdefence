const mongoose = require("mongoose");

const savedServiceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a client can only save a service once
savedServiceSchema.index({ client: 1, service: 1 }, { unique: true });

module.exports = mongoose.models.SavedService || mongoose.model("SavedService", savedServiceSchema);
