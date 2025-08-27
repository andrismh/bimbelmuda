import mongoose from "mongoose";
import { config } from "dotenv";

config();
const mongoURI = process.env.MONGODB_URI;

async function connectDB() {
    if (db) return db;

    try {
        db = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB!');
        return db;
    } catch (err) {
        console.error('MongoDB connection error: ', err);
        throw err;
    }
};

export default connectDB;