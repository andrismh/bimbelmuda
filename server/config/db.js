// server/config/db.js
import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env (adjust path if your .env isn't next to this file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, "..", "..", ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connect() {
  try {
    if (isConnected) {
      return mongoose;
    }

    await mongoose.connect(MONGODB_URI, { dbName: "bimbel-muda-blogs" });
    isConnected = true;
    console.log("✅ MongoDB Connected");
    return mongoose;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}

export default mongoose;
