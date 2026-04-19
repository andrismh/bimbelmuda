# Routing & Controllers

## `mainRouter` — Page Routing

Defined in `server/routes/mainRoute.js`, handled by `server/controllers/mainController.js`.

All routes serve static HTML files from `public/static/`.

| Controller Function | Route | File Served |
|---|---|---|
| `getHomePage` | `GET /` | `public/static/index.html` |
| `getProjectsPage` | `GET /projects` | `public/static/projects.html` |
| `getWritingsPage` | `GET /writings` | `public/static/writings.html` |
| `getPostPage` | `GET /writings/post` | `public/static/post.html` |
| `getCreatePostPage` | `GET /createPost` | `public/static/create-post.html` |
| `getAboutPage` | `GET /about` | `public/static/about.html` |
| `taxcalculator` | `GET /projects/taxcalculator` | `public/static/projects/tax-calculator.html` |
| `formspj` | `GET /projects/formspj` | `public/static/projects/form-spj.html` |

### `listPosts` (in `mainController.js`)

Exported and registered on `GET /api/posts/paginated` (in `dbRoute.js`). Accepts `?page` and `?limit` query params. Filters posts with `status: "published"`, sorts by `publishedAt` descending, and returns a paginated response including metadata. See [3-api-endpoints.md](3-api-endpoints.md) for response shape.

---

## `dbRouter` — CRUD Routes

Defined in `server/routes/dbRoute.js`, handled by `server/controllers/dbController.js`.

Route order matters — specific routes (`/api/posts/paginated`, `/api/posts/slug/:slug`) are registered before the parameterized `GET /api/posts/:id` to prevent path shadowing.

See [3-api-endpoints.md](3-api-endpoints.md) for full endpoint documentation.

---

## `generatorRouter` — SSG Routes

Defined in `server/routes/generatorRoute.js`, handled by `server/controllers/generatorController.js`.

See [4-static-site-generation.md](4-static-site-generation.md) for documentation.
