import { Router } from "express";
import { body } from "express-validator";
import {
  generateAllPages,
  generatePostPage,
  generateCustomPage,
  listGeneratedPages,
  deleteGeneratedPage,
  clearAllGeneratedPages
} from "../controllers/generatorController.js";

const generatorRouter = Router();

// Validators
const customPageValidators = [
  body("template").isString().trim().notEmpty().withMessage("Template name is required"),
  body("outputName").isString().trim().notEmpty().withMessage("Output name is required"),
  body("data").optional().isObject().withMessage("Data must be an object")
];

// Generator routes
generatorRouter.post("/api/generate/all", generateAllPages);
generatorRouter.post("/api/generate/post/:id", generatePostPage);
generatorRouter.post("/api/generate/custom", customPageValidators, generateCustomPage);
generatorRouter.get("/api/generated", listGeneratedPages);
generatorRouter.delete("/api/generated/:filename", deleteGeneratedPage);
generatorRouter.delete("/api/generated", clearAllGeneratedPages);

export default generatorRouter;