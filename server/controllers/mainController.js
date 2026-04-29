import path from "path";
import { fileURLToPath } from "url";
import Post from "../config/post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATIC_DIR = path.join(__dirname, "../../public/static");
const staticPage = (rel) => (req, res) => res.sendFile(path.join(STATIC_DIR, rel));

export const getHomePage = staticPage("index.html");
export const getProjectsPage = staticPage("projects.html");
export const getWritingsPage = staticPage("writings.html");
export const getPostPage = staticPage("post.html");
export const getCreatePostPage = staticPage("create-post.html");
export const getEditPostPage = staticPage("edit-post.html");
export const getAboutPage = staticPage("about.html");
export const taxcalculator = staticPage("projects/tax-calculator.html");
export const formspj = staticPage("projects/form-spj.html");

// GET /api/posts/paginated?page=1&limit=9
export async function listPosts(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "9", 10), 1);
    const skip = (page - 1) * limit;

    const filter = { status: "published" };
    const sort = { publishedAt: -1 };

    const [items, total] = await Promise.all([
      Post.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("_id title slug excerpt tags publishedAt createdAt")
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
