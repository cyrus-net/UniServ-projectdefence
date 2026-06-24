const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");
const { registerUser, loginUser, updateUserProfile, googleAuth, updateThemePreference } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.put("/profile", auth, updateUserProfile);
router.put("/theme", auth, updateThemePreference);

module.exports = router;