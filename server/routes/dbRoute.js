import { Router } from "express";
import { body } from "express-validator";
import {
  createPost,
  getPosts,
  getPostTitles,
  updatePost,
  deletePost,
} from "../controllers/dbController.js";

const dbRouter = Router();

// validators
const createValidators = [
  body("title").isString().trim().notEmpty().withMessage("title is required"),
  body("content")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("content is required"),
];

const updateValidators = [
  body("title").optional().isString().trim().notEmpty(),
  body("content").optional().isString().trim().notEmpty(),
];

// RESTful routes under one resource path
dbRouter.post("/api/posts", createValidators, createPost);
dbRouter.get("/api/posts", getPosts);
dbRouter.get("/api/posts/:id", getPosts);
dbRouter.get("/api/titles", getPostTitles);
dbRouter.patch("/api/posts/:id", updateValidators, updatePost); // or .put(...)
dbRouter.delete("/api/posts/:id", deletePost);

export default dbRouter;
