# Static Site Generation (SSG)

One of the application's prominent architectural choices lies in utilizing an internal **Static Site Generator**. It converts underlying backend configurations and dynamic database information natively down directly into fast static `.html` webpages utilizing EJS templates. 

## System Core Logic

The overall core executes out of `server/controllers/generatorController.js`.
The pipeline runs through these internal environment hooks:
* **`ROOT`**: System `process.cwd()` extraction.
* **`VIEWS_DIR`**: Extracts dynamic EJS definitions mapped to `/views`.
* **`GENERATED_DIR`**: Defines storage output mapping directory `public/generated`. As files are written here natively, they become instantly served from the overarching `express.static()` middleware.

## Main Functionalities

The generator controller provides specific generator endpoints listed underneath `server/routes/generatorRoute.js`.

### 1. Execute Large-Scale Generators: `generateAllPages`
- **Path:** `POST /api/generate/all`
- **Operations:**
  - Queries `Post.find().sort({ createdAt: -1 })` natively fetching the full article listing directly out from MongoDB.
  - Generates HTML page representations against each post executing through the EJS layout mechanism (`views/pages/post.ejs`).
  - Serializes an active generated collection into `public/generated/post-{_id}.html` documents format automatically parsing internal parameters.
  - Dynamically synthesizes an index directory map utilizing an overview EJS element via `views/pages/generated-index.ejs`. Returns its map to `public/generated/index.html`.

### 2. Isolate Targeted Generation: `generatePostPage`
- **Path:** `POST /api/generate/post/:id`
- **Operations:**
  - Executes validation directly for ID requirements mapping single document execution fetching logic, returning quick generation iterations specifically useful upon localized edit saving patterns minimizing overhead logic.

### 3. Generate Custom Template Logic Integration: `generateCustomPage` 
- **Path:** `POST /api/generate/custom`
- **Requirements Structure:** Enacts specific validation schemas demanding explicit combinations:
    - `template`: Native target parameter inside the `.ejs` architecture.
    - `outputName`: What configuration should map to the final explicit target.
    - `data`: (Optional) Injection JSON schema variables logic to the template core context itself.

### 4. Admin Management Modules

Additionally provides clean validation and control over active generated state items avoiding bloating requirements:
- **List generated objects (`listGeneratedPages`) - `GET /api/generated`:** Verifies folder availability (`fs.readdir`), generating dynamic active size maps and date mappings context information logic directly over existing files.
- **De-register object contexts (`deleteGeneratedPage`) - `DELETE /api/generated/:filename`:** Safely handles file `fs.unlink()` operations on mapped directories.
- **Wipe completely (`clearAllGeneratedPages`) - `DELETE /api/generated`:** Truncates the total mapped generated HTML document listing mapping logic natively back into pure origins cleanly.
