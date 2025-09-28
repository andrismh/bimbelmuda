// server/config/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let isConnected = false;

export async function connect() {
  try {
    if (isConnected) {
      return mongoose;
    }

    await mongoose.connect(MONGODB_URI, { 
      dbName: "bimbel-muda-blogs",
      serverSelectionTimeoutMS: 10000,
      family: 4
     });
    isConnected = true;
    console.log("✅ MongoDB Connected");
    return mongoose;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}
// server/config/db.js
console.log("MONGODB_URI present?", !!process.env.MONGODB_URI);


export default mongoose;
