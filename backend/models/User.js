const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "seller"],
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    photoBase64: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
      default: "",
    },
    googleAccessToken: {
      type: String,
      default: null,
    },
    googleRefreshToken: {
      type: String,
      default: null,
    },
    googleTokenExpiry: {
      type: Date,
      default: null,
    },
    themePreference: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    notificationPreferences: {
      email: {
        newBookings: { type: Boolean, default: true },
        reviews: { type: Boolean, default: true },
        orderUpdates: { type: Boolean, default: true },
      },
      push: {
        realTimeUpdates: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);