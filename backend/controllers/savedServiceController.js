const SavedService = require("../models/SavedService");

// Save a service for a client
async function saveService(req, res) {
  try {
    const { serviceId } = req.body;

    const savedService = await SavedService.create({
      client: req.userId,
      service: serviceId,
    });

    res.status(201).json(savedService);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Service already saved" });
    }
    res.status(500).json({ message: error.message });
  }
}

// Unsave a service for a client
async function unsaveService(req, res) {
  try {
    const { serviceId } = req.params;

    const result = await SavedService.findOneAndDelete({
      client: req.userId,
      service: serviceId,
    });

    if (!result) {
      return res.status(404).json({ message: "Saved service not found" });
    }

    res.status(200).json({ message: "Service unsaved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get saved services for a client
async function getSavedServices(req, res) {
  try {
    const savedServices = await SavedService.find({ client: req.userId })
      .populate("service")
      .sort({ createdAt: -1 });

    res.status(200).json(savedServices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Check if a service is saved by a client
async function isServiceSaved(req, res) {
  try {
    const { serviceId } = req.params;

    const savedService = await SavedService.findOne({
      client: req.userId,
      service: serviceId,
    });

    res.status(200).json({ isSaved: !!savedService });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { saveService, unsaveService, getSavedServices, isServiceSaved };
