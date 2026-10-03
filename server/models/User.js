import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    notifications: {
      transaction: {
        type: Boolean,
        default: true,
      },

      budget: {
        type: Boolean,
        default: true,
      },

      goal: {
        type: Boolean,
        default: false,
      },

      email: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;