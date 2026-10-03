import express from "express";

import {
  addGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  updateSavedAmount,
} from "../controllers/goalController.js";

const router = express.Router();

router.post("/", addGoal);
router.get("/:userId", getGoals);
router.put("/:id", updateGoal);
router.patch("/:id/saved", updateSavedAmount);
router.delete("/:id", deleteGoal);

export default router;