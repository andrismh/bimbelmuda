import { Router } from "express";
import {
  getHomePage,
  getProjectsPage,
  getWritingsPage,
  getPostPage,
  getCreatePostPage,
  getEditPostPage,
  getAboutPage,
  taxcalculator,
  formspj,
} from "../controllers/mainController.js";

const mainRouter = Router();

mainRouter.get("/", getHomePage);
mainRouter.get("/projects", getProjectsPage);
mainRouter.get("/writings", getWritingsPage);
mainRouter.get("/writings/post", getPostPage);
mainRouter.get("/createPost", getCreatePostPage);
mainRouter.get("/editPost", getEditPostPage);
mainRouter.get("/about", getAboutPage);
mainRouter.get("/projects/taxcalculator", taxcalculator);
mainRouter.get("/projects/formspj", formspj);

export default mainRouter;
