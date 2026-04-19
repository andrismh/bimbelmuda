# Database Connectivity & Schemas

The data persistence layer is handled through MongoDB, accessed via Mongoose.

## 1. Connection Configuration (`server/config/db.js`)

- Uses `MONGODB_URI` environment variable.
- Database name: `bimbel-muda-blogs`
- Implements an `isConnected` cache to avoid redundant connections on hot-reload.
- Connection timeout: `serverSelectionTimeoutMS: 10000`
- Forces IPv4 via `family: 4`

## 2. Blog Post Schema (`server/config/post.js`)

Collection: `blogContents`

### Schema Fields

| Field | Type | Rules | Purpose |
|---|---|---|---|
| `title` | String | Required | Post headline |
| `content` | String | Required | Full post body |
| `slug` | String | Unique, sparse | URL-friendly identifier, auto-generated from title via `slugify` |
| `excerpt` | String | Optional | Short preview text; auto-sliced to 150 chars from content if not provided |
| `status` | String | Enum: `"draft"` \| `"published"`, default: `"draft"` | Publication state |
| `publishedAt` | Date | Optional | Set automatically when `status` changes to `"published"` |
| `tags` | [String] | Optional | Array of topic tags |
| `createdAt` | Date | Auto (timestamps) | Creation timestamp |
| `updatedAt` | Date | Auto (timestamps) | Last modified timestamp |

### Pre-save Hook

A `pre("save")` hook runs automatically before each document is saved:
1. **Slug generation** — generates `slug` from `title` using `slugify({ lower: true, strict: true })` if not set or title changed.
2. **Excerpt generation** — sets `excerpt` to first 150 characters of `content` if not provided.
3. **publishedAt** — sets `publishedAt` to the current date when `status` transitions to `"published"` for the first time.

### Note on Existing Documents
Documents created before the schema update (pre-refinement) have only `title` and `content`. The `slug` and `excerpt` fields will be populated on next save. The paginated endpoint (`GET /api/posts/paginated`) filters by `status: "published"` — older posts need to be updated to show on the writings page.
