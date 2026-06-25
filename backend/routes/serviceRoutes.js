const express = require("express");
const router = express.Router();
const { auth, roleCheck } = require("../middleware/authMiddleware");
const {
  createService,
  getAllServices,
  getSellerServices,
  getSellerStats,
  updateService,
  deleteService,
  getServiceById,
} = require("../controllers/serviceController");

router.get("/:id", getServiceById); // Get service by ID (public)

// Get all services (public)
router.get("/", getAllServices);

// Get seller's services (seller only)
router.get("/my-services", auth, roleCheck(["seller"]), getSellerServices);

// Get seller dashboard stats (seller only)
router.get("/stats", auth, roleCheck(["seller"]), getSellerStats);

// Create service (seller only)
router.post("/", auth, roleCheck(["seller"]), createService);

// Update service (seller only)
router.put("/:id", auth, roleCheck(["seller"]), updateService);

// Delete service (seller only)
router.delete("/:id", auth, roleCheck(["seller"]), deleteService);

module.exports = router;
