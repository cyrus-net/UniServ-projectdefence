const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-marketplace";

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message || error);
    if (mongoUri.startsWith("mongodb+srv://")) {
      console.error(
        "If you are using Atlas, verify your cluster host, IP whitelist, and internet access."
      );
    }
    throw error;
  }
};

module.exports = connectDB;