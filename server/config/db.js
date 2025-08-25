import { MongoClient } from 'mongodb';
require("dotenv").config();

let db;

async function connectDB() {
    if (db) return db;
    
    const client = new MongoClient(process.env.MONGO_URI)
    await client.connect()
    db = client.db(process.env.DB_NAME)

    console.log("Connected to MongoDB:", process.env.DB_NAME)
    return db;
}

module.exports = connectDB;