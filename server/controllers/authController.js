import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* =========================
   SIGNUP
========================= */

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currency: user.currency,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   LOGIN
========================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currency: user.currency,
        notifications: user.notifications,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   GET PROFILE
========================= */

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   UPDATE PROFILE
========================= */

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, currency } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || "",
        currency: currency || "INR",
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   CHANGE PASSWORD
========================= */

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   UPDATE NOTIFICATIONS
========================= */

export const updateNotifications = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;
    const { notifications } = req.body;

    if (!notifications) {
      return res.status(400).json({
        success: false,
        message: "Notification settings are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        notifications: {
          transaction:
            notifications.transaction ?? true,

          budget:
            notifications.budget ?? true,

          goal:
            notifications.goal ?? false,

          email:
            notifications.email ?? true,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification settings saved",
      user,
    });
  } catch (error) {
    console.error(
      "Notification update error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   DELETE ACCOUNT
========================= */

export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};