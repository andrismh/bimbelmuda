import { validationResult } from 'express-validator';
import Post from '../config/post.js';

async function getCollection() {
    const db = await connectDB();
    return db.collection("posts");
};

// Create One Document
export const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try {
        const newPost = await Post.create(req.body);
        res.status(201).json(newPost);
    } catch (err) {
        next(err);
    }
};

// Read Document
export const getPosts = async (req, res, next) => {
    try {
        if (req.params.id) {
            const post = await Post.findById(req.params.id);
            if (!post) return res.status(404).json({ message: 'Not found' });
            return res.json(post)
        }
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

// Update Document
export const updatePost = async (req, res, next) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// Delete Document
export const deletePost = async (req, res, next) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Post deleted', post: deleted });
    } catch (err) {
        next(err);
    }
};