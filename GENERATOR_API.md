# HTML Generator API Documentation

This controller provides functionality to generate static HTML files from EJS templates using data from the database.

## Available Endpoints

### 1. Generate All Pages
**POST** `/api/generate/all`

Generates HTML files for all posts in the database plus an index page.

**Response:**
```json
{
  "success": true,
  "message": "All pages generated successfully",
  "generatedPages": [
    {
      "id": "post_id",
      "title": "Post Title",
      "path": "/path/to/generated/file.html",
      "url": "/generated/post-id.html"
    }
  ],
  "indexPage": {
    "path": "/path/to/index.html",
    "url": "/generated/index.html"
  },
  "totalPages": 5
}
```

### 2. Generate Specific Post Page
**POST** `/api/generate/post/:id`

Generates HTML for a specific post by ID.

**Parameters:**
- `id` (string): Post ID

**Response:**
```json
{
  "success": true,
  "message": "Post page generated successfully",
  "post": {
    "id": "post_id",
    "title": "Post Title",
    "path": "/path/to/generated/file.html",
    "url": "/generated/post-id.html"
  }
}
```

### 3. Generate Custom Page
**POST** `/api/generate/custom`

Generates HTML from any EJS template with custom data.

**Request Body:**
```json
{
  "template": "template-name",
  "data": {
    "customData": "value"
  },
  "outputName": "output-filename"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Custom page generated successfully",
  "page": {
    "template": "template-name",
    "outputName": "output-filename",
    "path": "/path/to/generated/file.html",
    "url": "/generated/output-filename.html"
  }
}
```

### 4. List Generated Pages
**GET** `/api/generated`

Lists all generated HTML files.

**Response:**
```json
{
  "success": true,
  "pages": [
    {
      "name": "filename.html",
      "path": "/full/path/to/file.html",
      "url": "/generated/filename.html",
      "size": 1024,
      "lastModified": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 3
}
```

### 5. Delete Generated Page
**DELETE** `/api/generated/:filename`

Deletes a specific generated HTML file.

**Parameters:**
- `filename` (string): Name of the file to delete

**Response:**
```json
{
  "success": true,
  "message": "File filename.html deleted successfully"
}
```

### 6. Clear All Generated Pages
**DELETE** `/api/generated`

Deletes all generated HTML files.

**Response:**
```json
{
  "success": true,
  "message": "Deleted 5 generated pages",
  "deletedFiles": ["file1.html", "file2.html", "file3.html"]
}
```

## Template Requirements

### Post Template (`views/pages/post.ejs`)
The post template should expect the following data:
- `post`: Full post object from database
- `title`: Post title
- `content`: Post content
- `createdAt`: Creation date
- `updatedAt`: Last update date

### Index Template (`views/pages/generated-index.ejs`)
The index template should expect:
- `posts`: Array of all posts
- `title`: Page title (optional)
- `totalPosts`: Total number of posts

## Generated Files Location

All generated HTML files are saved to: `public/generated/`

## Usage Examples

### Generate all pages:
```bash
curl -X POST http://localhost:3000/api/generate/all
```

### Generate specific post:
```bash
curl -X POST http://localhost:3000/api/generate/post/64a1b2c3d4e5f6789abcdef0
```

### Generate custom page:
```bash
curl -X POST http://localhost:3000/api/generate/custom \
  -H "Content-Type: application/json" \
  -d '{
    "template": "about",
    "data": {"title": "About Us", "content": "Our story..."},
    "outputName": "about-page"
  }'
```

### List generated pages:
```bash
curl http://localhost:3000/api/generated
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing required parameters)
- `404`: Not Found (post/template not found)
- `500`: Internal Server Error

Error responses include a `message` field with details about the error.
