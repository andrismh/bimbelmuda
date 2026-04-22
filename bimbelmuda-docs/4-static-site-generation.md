# Static Site Generation (SSG)

The app includes a pipeline that renders database-backed posts into static HTML files using EJS templates. Output lands in `public/generated/` and is served directly by the `express.static()` middleware.

## Core Module

All logic lives in `server/controllers/generatorController.js`. Three module-level constants scope the pipeline:

- `ROOT` — `process.cwd()` (the project root)
- `VIEWS_DIR` — `<ROOT>/views`, source of EJS templates
- `GENERATED_DIR` — `<ROOT>/public/generated`, where rendered HTML is written

## Endpoints

Registered in `server/routes/generatorRoute.js`.

### 1. `generateAllPages` — `POST /api/generate/all`

- Loads every post (`Post.find().sort({ createdAt: -1 })`).
- For each post, renders Markdown to HTML via `renderMarkdown()` and passes it into `views/pages/post.ejs`. Output: `public/generated/post-<_id>.html`.
- Also renders `views/pages/generated-index.ejs` as `public/generated/index.html`, a listing of all generated post pages.
- Returns metadata for every generated file.

### 2. `generatePostPage` — `POST /api/generate/post/:id`

Regenerates the single post page for `:id`. Used for incremental updates (e.g. after editing one post).

### 3. `generateCustomPage` — `POST /api/generate/custom`

Renders an arbitrary EJS template in `views/pages/` with caller-supplied data.

- Body:
  - `template` (required) — template name, without the `.ejs` extension
  - `outputName` (required) — output filename stem (written as `<outputName>.html`)
  - `data` (optional object) — variables injected into the template
- Validation is performed by `express-validator` (`customPageValidators` in `generatorRoute.js`).
- Returns `404` if the template file does not exist.

### 4. Management endpoints

- `GET /api/generated` — `listGeneratedPages`: lists every `.html` file under `GENERATED_DIR` with `size` and `lastModified`.
- `DELETE /api/generated/:filename` — `deleteGeneratedPage`: deletes a single file.
- `DELETE /api/generated` — `clearAllGeneratedPages`: deletes all `.html` files in `GENERATED_DIR`.

See [../GENERATOR_API.md](../GENERATOR_API.md) for full request/response payload examples.
