import mongoose from "mongoose";
import Goal from "../models/Goal.js";

export const addGoal = async (req, res) => {
  try {
    const { userId, title, target, saved, deadline } = req.body;

    if (!userId || !title || !target || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, target and deadline are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const numericTarget = Number(target);
    const numericSaved = Number(saved) || 0;

    if (Number.isNaN(numericTarget) || numericTarget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target must be greater than 0",
      });
    }

    if (numericSaved < 0 || numericSaved > numericTarget) {
      return res.status(400).json({
        success: false,
        message: "Saved amount must be between 0 and target",
      });
    }

    const goal = await Goal.create({
      user: userId,
      title: title.trim(),
      target: numericTarget,
      saved: numericSaved,
      deadline: new Date(deadline),
    });

    return res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    console.error("Add goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating goal",
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const goals = await Goal.find({
      user: userId,
    }).sort({
      deadline: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      goals,
    });
  } catch (error) {
    console.error("Get goals error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading goals",
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, target, saved, deadline } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    const numericTarget = Number(target);
    const numericSaved = Number(saved);

    if (!title || !target || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, target and deadline are required",
      });
    }

    if (Number.isNaN(numericTarget) || numericTarget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target must be greater than 0",
      });
    }

    if (
      Number.isNaN(numericSaved) ||
      numericSaved < 0 ||
      numericSaved > numericTarget
    ) {
      return res.status(400).json({
        success: false,
        message: "Saved amount must be between 0 and target",
      });
    }

    const goal = await Goal.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        target: numericTarget,
        saved: numericSaved,
        deadline: new Date(deadline),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating goal",
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    const goal = await Goal.findByIdAndDelete(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting goal",
    });
  }
};

export const updateSavedAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { saved } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    const numericSaved = Number(saved);

    if (Number.isNaN(numericSaved) || numericSaved < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid saved amount",
      });
    }

    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    if (numericSaved > goal.target) {
      return res.status(400).json({
        success: false,
        message: "Saved amount cannot exceed target",
      });
    }

    goal.saved = numericSaved;

    await goal.save();

    return res.status(200).json({
      success: true,
      message: "Saved amount updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update saved amount error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating saved amount",
    });
  }
};