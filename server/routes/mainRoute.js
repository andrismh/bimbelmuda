// routes/index.js
import { Router } from 'express';
const mainRouter = Router();
import {
    getHomePage, getProjectsPage, getWritingsPage, getCreatePostPage, getAboutPage
} from '../controllers/mainController.js';

mainRouter.get('/', getHomePage);
mainRouter.get('/projects', getProjectsPage);
mainRouter.get('/writings', getWritingsPage);
mainRouter.get('/createPost', getCreatePostPage);
mainRouter.get('/about', getAboutPage);

export default mainRouter;