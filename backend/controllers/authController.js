const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

async function registerUser(req, res) {
  try {
    const { fullName, email, password, role, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      bio,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      photoBase64: user.photoBase64,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      photoBase64: user.photoBase64,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function googleAuth(req, res) {
  try {
    const { credential, role, accessToken, refreshToken, expiresIn } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email_verified) {
      return res.status(400).json({ message: "Unable to verify Google account" });
    }

    const email = payload.email;
    const fullName = payload.name || "";
    const picture = payload.picture || "";
    const googleId = payload.sub;

    let user = await User.findOne({ email });
    if (!user) {
      if (!role) {
        return res.status(400).json({ message: "Role is required for Google sign up" });
      }

      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role,
        bio: "",
        photoBase64: picture,
        googleId,
      });
    } else {
      // Update existing user with Google tokens if provided
      if (accessToken) user.googleAccessToken = accessToken;
      if (refreshToken) user.googleRefreshToken = refreshToken;
      if (expiresIn) {
        user.googleTokenExpiry = new Date(Date.now() + expiresIn * 1000);
      }
      await user.save();
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      photoBase64: user.photoBase64,
      themePreference: user.themePreference,
      notificationPreferences: user.notificationPreferences,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: error.message || "Google authentication failed" });
  }
}

async function updateUserProfile(req, res) {
  try {
    const { fullName, email, bio, photoBase64, notificationPreferences } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      return res.status(400).json({ message: "Email cannot be changed" });
    }

    if (fullName) {
      user.fullName = fullName;
    }

    if (bio !== undefined) {
      user.bio = bio;
    }

    if (photoBase64 !== undefined) {
      user.photoBase64 = photoBase64;
    }

    if (notificationPreferences !== undefined) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences,
        email: {
          ...user.notificationPreferences.email,
          ...notificationPreferences.email,
        },
        push: {
          ...user.notificationPreferences.push,
          ...notificationPreferences.push,
        },
      };
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      photoBase64: updatedUser.photoBase64,
      themePreference: updatedUser.themePreference,
      notificationPreferences: updatedUser.notificationPreferences,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
}

async function updateThemePreference(req, res) {
  try {
    const { themePreference } = req.body;
    
    if (!["light", "dark"].includes(themePreference)) {
      return res.status(400).json({ message: "Invalid theme preference" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { themePreference },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ themePreference: user.themePreference });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getGoogleTokens(req, res) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.googleAccessToken) {
      return res.status(404).json({ message: "No Google tokens found" });
    }

    // Check if token is expired and refresh if needed
    if (user.googleTokenExpiry && new Date() > user.googleTokenExpiry) {
      if (user.googleRefreshToken) {
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              refresh_token: user.googleRefreshToken,
              grant_type: 'refresh_token',
            }),
          });

          const data = await response.json();
          user.googleAccessToken = data.access_token;
          user.googleTokenExpiry = new Date(Date.now() + data.expires_in * 1000);
          await user.save();
        } catch (refreshError) {
          console.error("Token refresh error:", refreshError);
        }
      }
    }

    res.json({
      accessToken: user.googleAccessToken,
      refreshToken: user.googleRefreshToken,
      expiresAt: user.googleTokenExpiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { registerUser, loginUser, googleAuth, updateUserProfile, updateThemePreference, getGoogleTokens };