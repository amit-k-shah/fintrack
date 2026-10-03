import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      amount,
      type,
      date,
    } = req.body;

    if (
      !userId ||
      !title ||
      !category ||
      amount === undefined ||
      !type
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction type",
      });
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const transaction = await Transaction.create({
      user: userId,
      title: title.trim(),
      category: category.trim(),
      amount: numericAmount,
      type,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction,
    });
  } catch (error) {
    console.error("Add transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while adding transaction",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const transactions = await Transaction.find({
      user: userId,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while loading transactions",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transaction ID",
      });
    }

    const transaction =
      await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting transaction",
    });
  }
};