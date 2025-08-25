// routes/index.js
import { Router } from 'express';
const router = Router();
import { getHomePage, getAboutPage, getContactPage } from '../controllers/indexController';

// GET / - Home page (SSG-like)
router.get('/', getHomePage);

// GET /about - About page (SSG-like)
router.get('/about', getAboutPage);

// GET /contact - Contact page (SSG-like)
router.get('/contact', getContactPage);

export default router;