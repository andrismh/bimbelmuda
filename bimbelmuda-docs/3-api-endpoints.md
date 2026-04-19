# API Endpoints

All data API endpoints are defined in `server/routes/dbRoute.js` and handled in `server/controllers/dbController.js`. Pagination is handled by `listPosts` from `server/controllers/mainController.js`.

Base path: `/api/`

## Blog Post Endpoints

### `GET /api/posts/paginated`
Paginated list of **published** posts. Sorted by `publishedAt` descending.

- **Query params:** `page` (default: 1), `limit` (default: 9)
- **Response:**
  ```json
  {
    "items": [{ "_id", "title", "slug", "excerpt", "tags", "publishedAt", "createdAt" }],
    "page": 1,
    "limit": 9,
    "total": 42,
    "totalPages": 5,
    "hasPrev": false,
    "hasNext": true,
    "prevPage": null,
    "nextPage": 2
  }
  ```

### `GET /api/posts/slug/:slug`
Fetch a single post by its URL slug.

- **Params:** `slug` — URL-friendly string (e.g. `my-post-title`)
- **Response:** Full post document or `404`

### `GET /api/titles`
Lightweight endpoint returning `_id`, `title`, `content`, `excerpt`, and `createdAt` for all posts (no pagination, no status filter).

### `POST /api/posts`
Create a new blog post.

- **Body:** `title` (required), `content` (required), `status` (optional), `tags` (optional array), `slug` (optional — auto-generated from title if omitted), `excerpt` (optional — auto-sliced from content if omitted)
- **Validation:** `express-validator` middleware sanitizes title and content.
- **Response:** `201 Created` with full document

### `GET /api/posts`
Fetch all posts (no filter, no pagination).

### `GET /api/posts/:id`
Fetch a single post by MongoDB ObjectID.

- **Params:** `id` — 24-character hex ObjectID
- **Response:** Full post document or `404`

### `PATCH /api/posts/:id`
Partially update a post.

- **Params:** `id`
- **Body:** Any combination of `title`, `content`, `slug`, `excerpt`, `status`, `tags`
- **Note:** If `title` is updated and no explicit `slug` is provided, slug is auto-regenerated.
- **Response:** Updated document or `404`

### `DELETE /api/posts/:id`
Delete a post by ID.

- **Response:** `{ "message": "Post deleted", "post": {...} }` or `404`

### `GET /api/ping`
Health check. Returns `"pong"`.
