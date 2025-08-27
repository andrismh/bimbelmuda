// routes/index.js
import { Router } from 'express';
const mainRouter = Router();
import { getHomePage, getAboutPage, getProjectsPage } from '../controllers/mainController.js';

// GET / - Home page (SSG-like)
mainRouter.get('/', getHomePage);

// GET /about - About page (SSG-like)
mainRouter.get('/about', getAboutPage);

// GET /contact - Contact page (SSG-like)
mainRouter.get('/contact', getProjectsPage);

export default mainRouter;