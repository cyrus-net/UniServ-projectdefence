const express = require("express");
const router = express.Router();
const { auth, roleCheck } = require("../middleware/authMiddleware");
const {
  saveService,
  unsaveService,
  getSavedServices,
  isServiceSaved,
} = require("../controllers/savedServiceController");

// Save a service (client only)
router.post("/", auth, roleCheck(["client"]), saveService);

// Get saved services for client
router.get("/", auth, roleCheck(["client"]), getSavedServices);

// Check if service is saved
router.get("/:serviceId/is-saved", auth, roleCheck(["client"]), isServiceSaved);

// Unsave a service (client only)
router.delete("/:serviceId", auth, roleCheck(["client"]), unsaveService);

module.exports = router;
