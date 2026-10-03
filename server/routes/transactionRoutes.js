import express from "express";

import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

// Add transaction
router.post("/", addTransaction);

// Get all transactions for a user
router.get("/:userId", getTransactions);

// Delete transaction
router.delete("/:id", deleteTransaction);

export default router;