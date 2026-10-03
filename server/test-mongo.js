import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

try {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB CONNECTED");

    await mongoose.disconnect();
} catch (error) {
    console.log("MongoDB ERROR:");
    console.log(error);
}