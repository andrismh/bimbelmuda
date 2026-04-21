import { Router } from "express";
import { body } from "express-validator";
import {
  createPost,
  getPosts,
  getPostBySlug,
  getPostTitles,
  getRenderedPost,
  updatePost,
  deletePost,
} from "../controllers/dbController.js";
import { listPosts } from "../controllers/mainController.js";

const dbRouter = Router();

const createValidators = [
  body("title").isString().trim().notEmpty().withMessage("title is required"),
  body("content").isString().trim().notEmpty().withMessage("content is required"),
];

const updateValidators = [
  body("title").optional().isString().trim().notEmpty(),
  body("content").optional().isString().trim().notEmpty(),
];

// order matters: specific routes before parameterized ones
dbRouter.get("/api/posts/paginated", listPosts);
dbRouter.get("/api/posts/slug/:slug", getPostBySlug);
dbRouter.get("/api/titles", getPostTitles);
dbRouter.post("/api/posts", createValidators, createPost);
dbRouter.get("/api/posts", getPosts);
dbRouter.get("/api/posts/:id/rendered", getRenderedPost);
dbRouter.get("/api/posts/:id", getPosts);
dbRouter.patch("/api/posts/:id", updateValidators, updatePost);
dbRouter.delete("/api/posts/:id", deletePost);

export default dbRouter;