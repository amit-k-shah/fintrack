import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import goalRoutes from "./routes/goalRoutes.js";

import { databaseConnection } from "./config/databaseConnection.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use("/api/goals", goalRoutes);

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FinTrack API is running",
  });
});

// =========================
// START SERVER
// =========================

const startServer = async () => {
  try {
    await databaseConnection();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();