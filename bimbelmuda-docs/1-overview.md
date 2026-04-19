# Project Overview: Bimbel Muda

This document provides a high-level overview of the `bimbelmuda` web application architecture and technology stack.

## System Architecture

The project is built on a Node.js and Express.js stack using a monolithic backend architecture to serve static assets, provide RESTful APIs, and handle Static Site Generation (SSG).

### Tech Stack

- **Runtime Environment:** Node.js (ES Modules)
- **Web Framework:** Express.js (v5.1.0)
- **Database:** MongoDB
- **ODM / Database Client:** Mongoose
- **Templating Engine:** EJS (used by the SSG pipeline)
- **Frontend Styling:** Tailwind CSS v4 (compiled via `@tailwindcss/cli`)
- **Security & Logging Middleware:** Helmet, Morgan
- **Validation:** `express-validator`
- **Utilities:** `slugify`, `fs-extra`

## Application Entry Point (`server/app.js`)

The main entry point for the backend server is located at `server/app.js`.

### Core Responsibilities:
1. **Middleware Setup:** Helmet security headers, Morgan request logging, JSON/form body parsers.
2. **Static Asset Provisioning:** Exposes the `/public` directory globally.
3. **Router Delegations:**
   - `dbRouter` — CRUD interactions with MongoDB (`/api/posts`, `/api/titles`)
   - `mainRouter` — Page routing to static HTML views
   - `generatorRouter` — Static site generation pipeline
4. **Error Handling:** Centralized error middleware returning JSON responses.
5. **Database Invocation:** Waits for MongoDB connection before accepting traffic.

## Frontend Architecture

All pages are static HTML files in `public/static/` styled with Tailwind CSS v4. JavaScript is split into page-specific files in `public/js/`:

| JS File | Page | Responsibility |
|---|---|---|
| `writings.js` | `/writings` | Fetch paginated posts, render cards, pagination controls |
| `post.js` | `/writings/post` | Fetch and render a single post by `?id=` |
| `create-post.js` | `/createPost` | Handle post creation form submission |
| `tax-calculator.js` | `/projects/taxcalculator` | Tax calculation logic |
| `form-spj.js` | `/projects/formspj` | SPJ form logic |

## CSS Build

Tailwind CSS is compiled from `public/css/input.css` to `public/css/style.css`.

```bash
npm run build:css   # one-time build
npm run watch:css   # rebuild on file changes (use alongside npm run dev)
```

Custom fonts (Poppins, EduNSW, Mildstones) are declared in `public/css/input.css` via `@font-face` and exposed as Tailwind theme tokens (`font-poppins`, `font-edu`, `font-mild`).

## File Hierarchy

```text
📁 e:\projects\bimbelmuda
├── 📁 bimbelmuda-docs/       # Project documentation (you are here)
├── 📁 public/
│   ├── 📁 css/
│   │   ├── input.css         # Tailwind source file
│   │   ├── style.css         # Compiled Tailwind output (do not edit directly)
│   │   ├── tax-calculator.css
│   │   └── form-spj.css
│   ├── 📁 js/
│   │   ├── writings.js       # Paginated post listing
│   │   ├── post.js           # Single post view
│   │   ├── create-post.js    # Post creation form
│   │   ├── tax-calculator.js
│   │   └── form-spj.js
│   ├── 📁 generated/         # SSG output HTML pages
│   ├── 📁 static/            # Static HTML pages
│   └── 📁 assets/            # Fonts and images
├── 📁 server/
│   ├── app.js
│   ├── 📁 config/            # db.js, post.js (Mongoose schema)
│   ├── 📁 controllers/       # dbController, generatorController, mainController
│   └── 📁 routes/            # dbRoute, generatorRoute, mainRoute
└── 📁 views/
    ├── 📁 pages/             # EJS templates (used by SSG pipeline)
    ├── 📁 partials/
    └── 📁 layout/
```
