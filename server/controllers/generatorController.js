import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import ejs from "ejs";
import { validationResult } from "express-validator";
import Post from "../config/post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const VIEWS_DIR = path.join(ROOT, "views");
const GENERATED_DIR = path.join(ROOT, "public", "generated");

async function ensureGeneratedDir() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

async function renderPost(post) {
  const templatePath = path.join(VIEWS_DIR, "pages", "post.ejs");
  return ejs.renderFile(templatePath, {
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  });
}

// POST /api/generate/all
export const generateAllPages = async (req, res, next) => {
  try {
    await ensureGeneratedDir();
    const posts = await Post.find().sort({ createdAt: -1 }).lean();

    const generated = [];
    for (const post of posts) {
      const html = await renderPost(post);
      const filename = `post-${post._id}.html`;
      await fs.writeFile(path.join(GENERATED_DIR, filename), html, "utf8");
      generated.push(filename);
    }

    const indexTemplatePath = path.join(VIEWS_DIR, "pages", "generated-index.ejs");
    const indexHtml = await ejs.renderFile(indexTemplatePath, {
      title: "All Posts",
      posts,
      totalPosts: posts.length,
    });
    await fs.writeFile(path.join(GENERATED_DIR, "index.html"), indexHtml, "utf8");

    res.json({ message: "Generated all pages", files: ["index.html", ...generated] });
  } catch (err) {
    next(err);
  }
};

// POST /api/generate/post/:id
export const generatePostPage = async (req, res, next) => {
  try {
    await ensureGeneratedDir();
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ message: "Post not found" });

    const html = await renderPost(post);
    const filename = `post-${post._id}.html`;
    await fs.writeFile(path.join(GENERATED_DIR, filename), html, "utf8");

    res.json({ message: "Generated post page", file: filename });
  } catch (err) {
    next(err);
  }
};

// POST /api/generate/custom
export const generateCustomPage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    await ensureGeneratedDir();
    const { template, outputName, data = {} } = req.body;

    const templatePath = path.join(VIEWS_DIR, "pages", `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, data);
    const filename = outputName.endsWith(".html") ? outputName : `${outputName}.html`;
    await fs.writeFile(path.join(GENERATED_DIR, filename), html, "utf8");

    res.json({ message: "Generated custom page", file: filename });
  } catch (err) {
    next(err);
  }
};

// GET /api/generated
export const listGeneratedPages = async (req, res, next) => {
  try {
    await ensureGeneratedDir();
    const files = await fs.readdir(GENERATED_DIR);
    const htmlFiles = files.filter((f) => f.endsWith(".html"));

    const details = await Promise.all(
      htmlFiles.map(async (filename) => {
        const stat = await fs.stat(path.join(GENERATED_DIR, filename));
        return { filename, size: stat.size, updatedAt: stat.mtime };
      })
    );

    res.json(details);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/generated/:filename
export const deleteGeneratedPage = async (req, res, next) => {
  try {
    const filename = path.basename(req.params.filename);
    await fs.unlink(path.join(GENERATED_DIR, filename));
    res.json({ message: "Deleted", file: filename });
  } catch (err) {
    if (err.code === "ENOENT") return res.status(404).json({ message: "File not found" });
    next(err);
  }
};

// DELETE /api/generated
export const clearAllGeneratedPages = async (req, res, next) => {
  try {
    await ensureGeneratedDir();
    const files = await fs.readdir(GENERATED_DIR);
    const htmlFiles = files.filter((f) => f.endsWith(".html"));
    await Promise.all(htmlFiles.map((f) => fs.unlink(path.join(GENERATED_DIR, f))));
    res.json({ message: "Cleared all generated pages", count: htmlFiles.length });
  } catch (err) {
    next(err);
  }
};
