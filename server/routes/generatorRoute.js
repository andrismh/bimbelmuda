import { Router } from "express";
const generatorRouter = Router();
import {
  generateAllPages,
  generateStaticPages,
  generateBlogPages,
} from "../controllers/generatorController.js";

generatorRouter.get("/generate-all-pages", generateAllPages);
generatorRouter.get("/generate-static-pages", generateStaticPages);
generatorRouter.get("/generate-blog-pages", generateBlogPages);

export default generatorRouter;
