import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  try {
    if (isConnected) {
      return mongoose;
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set.");
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

export default mongoose;
