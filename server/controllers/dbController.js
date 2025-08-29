import { validationResult } from "express-validator";
import Post from "../config/post.js";
import mongoose from "mongoose";

// helper: pick only allowed keys
const pick = (obj, fields) =>
  fields.reduce((acc, f) => (obj[f] !== undefined ? (acc[f] = obj[f], acc) : acc), {});

// Create
export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = pick(req.body, ["title", "content"]);
    const newPost = await Post.create(data);
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

// Read (list or one)
export const getPosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id) {
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const post = await Post.findById(id).lean();
      if (!post) return res.status(404).json({ message: "Not found" });
      return res.json(post);
    }

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments()
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Update
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const data = pick(req.body, ["title", "content"]);
    const updated = await Post.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Post deleted", post: deleted });
  } catch (err) {
    next(err);
  }
};
