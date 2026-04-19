import { validationResult } from "express-validator";
import Post from "../config/post.js";
import mongoose from "mongoose";
import slugify from "slugify";

const pick = (obj, fields) => {
  const result = {};
  for (const field of fields) {
    if (obj[field] !== undefined) {
      result[field] = obj[field];
    }
  }
  return result;
};

const ALLOWED_FIELDS = ["title", "content", "slug", "excerpt", "status", "tags"];

export const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const data = pick(req.body, ALLOWED_FIELDS);

    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const newPost = await Post.create(data);
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    if (req.params.id) {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid id" });
      }
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Not found" });
      return res.json(post);
    }

    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const data = pick(req.body, ALLOWED_FIELDS);

    if (data.title && !data.slug) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }

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

export async function getPostTitles(req, res, next) {
  try {
    const posts = await Post.find({}, { _id: 1, title: 1, content: 1, excerpt: 1, createdAt: 1 }).lean();
    res.json(posts);
  } catch (err) {
    next(err);
  }
}
