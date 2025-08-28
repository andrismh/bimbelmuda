import { Router } from 'express';
import {
    createPost,
    getPosts,
    updatePost,
    deletePost
} from '../controllers/dbController.js';

const dbRouter = Router();

dbRouter.post("/api/posts", createPost);
dbRouter.get("/api/get", getPosts);
dbRouter.put("/api/put/:id", updatePost);
dbRouter.delete("/api/delete/:id", deletePost);

export default dbRouter;