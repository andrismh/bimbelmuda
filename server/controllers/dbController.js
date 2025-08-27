import { ObjectId } from 'mongodb';
import connectDB from '../config/db.js';

async function getCollection() {
    const db = await connectDB();
    return db.collection("posts");
};

// Create One Document
export const createPost = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try {
        const posts = await getCollection();
        const result = await posts.insertOne(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read Document
export const getPosts = async(req, res) => {
    try {
        const posts = await getCollection();
        const post = await posts.findOne({ _id: new ObjectId(req.params.id) });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Document
export const updatePost = async(req, res) => {
    try {
        const posts = await getCollection();
        const result = await posts.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// Delete Document
export const deletePost = async(req, res) => {
    try {
        const posts = await getCollection();
        const result = await posts.deleteOne(
            { _id: new ObjectId(req.params.id) }
        );
        res.json(result)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};