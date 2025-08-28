import mongoose from "mongoose";
import { config } from "dotenv";

config();
const MONGO_URI = process.env.MONGODB_URI;

export async function connect() {
    if (isConnected) {
        return mongoose;
    }

    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    isConnected = true;
    console.log('MongoDB Connected');
    return mongoose
}

export default mongoose;