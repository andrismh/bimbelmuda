import { Router } from 'express';
import {
    createPost,
    getPosts,
    updatePost,
    deletePost
} from '../controllers/dbController.js';

const dbRouter = Router();

dbRouter.post("/", createPost);
dbRouter.get("/", getPosts);
dbRouter.put("/:id", updatePost);
dbRouter.delete("/:id", deletePost);

export default dbRouter;