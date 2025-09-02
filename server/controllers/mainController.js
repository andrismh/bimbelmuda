import path from "path";
import { fileURLToPath } from "url";

// Re-create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getHomePage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/index.html"));
}

export function getProjectsPage(req, res) {
  res.sendFile("/#projects");
}

export function getWritingsPage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/writings.html"));
}

export function getCreatePostPage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/create-post.html"));
}

export function getAboutPage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/about.html"));
}

// GET /api/posts?page=1&limit=9
export async function listPosts(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "9", 10), 1);
    const skip = (page - 1) * limit;

    const filter = { status: "published" };
    const sort = { publishedAt: -1 }; // newest first

    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("_id title slug excerpt coverImageUrl publishedAt")
        .lean(),
      Post.countDocuments(filter),
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (err) {
    next(err);
  }
}
