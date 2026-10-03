import express from "express";

import {
  signup,
  login,
  getProfile,
  updateProfile,
  changePassword,
  updateNotifications,
  deleteAccount,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile/:userId", getProfile);

router.put("/profile/:userId", updateProfile);

router.put(
  "/password/:userId",
  changePassword
);

router.put(
  "/notifications/:userId",
  updateNotifications
);

router.delete(
  "/account/:userId",
  deleteAccount
);

export default router;