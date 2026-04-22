import path from "path";
import fs from "fs/promises";
import ejs from "ejs";
import Post from "../config/post.js";
import { renderMarkdown } from "../utils/renderMarkdown.js";

const ROOT = process.cwd();
const VIEWS_DIR = path.join(ROOT, "views");
const GENERATED_DIR = path.join(ROOT, "public", "generated");

// ---------------- controllers ----------------

export const generateAllPages = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    const generated = [];

    for (const post of posts) {
      const renderedContent = await renderMarkdown(post.content);
      const html = await ejs.renderFile(
        path.join(VIEWS_DIR, "pages", "post.ejs"),
        {
          post,
          title: post.title,
          content: post.content,
          renderedContent,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        },
        { root: VIEWS_DIR, views: [VIEWS_DIR] },
      );

      const outFile = path.join(GENERATED_DIR, `post-${post._id}.html`);
      await fs.mkdir(path.dirname(outFile), { recursive: true });
      await fs.writeFile(outFile, html, "utf8");

      generated.push({
        id: post._id,
        title: post.title,
        path: outFile,
        url: `/generated/post-${post._id}.html`,
      });
    }

    const indexHtml = await ejs.renderFile(
      path.join(VIEWS_DIR, "pages", "generated-index.ejs"),
      { posts, title: "All Posts", totalPosts: posts.length },
      { root: VIEWS_DIR, views: [VIEWS_DIR] },
    );
    const indexFile = path.join(GENERATED_DIR, "index.html");
    await fs.writeFile(indexFile, indexHtml, "utf8");

    res.json({
      success: true,
      message: "All pages generated",
      generatedPages: generated,
      indexPage: { path: indexFile, url: "/generated/index.html" },
      totalPages: generated.length + 1,
    });
  } catch (err) {
    next(err);
  }
};

export const generatePostPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Post ID is required" });

    const post = await Post.findById(id).lean();
    if (!post) return res.status(404).json({ message: "Post not found" });

    const renderedContent = await renderMarkdown(post.content);
    const html = await ejs.renderFile(
      path.join(VIEWS_DIR, "pages", "post.ejs"),
      {
        post,
        title: post.title,
        content: post.content,
        renderedContent,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
      { root: VIEWS_DIR, views: [VIEWS_DIR] },
    );

    const outFile = path.join(GENERATED_DIR, `post-${post._id}.html`);
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, html, "utf8");

    res.json({
      success: true,
      message: "Post page generated",
      post: {
        id: post._id,
        title: post.title,
        path: outFile,
        url: `/generated/post-${post._id}.html`,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const generateCustomPage = async (req, res, next) => {
  try {
    const { template, data, outputName } = req.body || {};
    if (!template || !outputName) {
      return res
        .status(400)
        .json({ message: "template and outputName are required" });
    }

    const templateFile = path.join(VIEWS_DIR, "pages", `${template}.ejs`);
    try {
      await fs.access(templateFile);
    } catch {
      return res
        .status(404)
        .json({ message: `Template ${template}.ejs not found` });
    }

    const html = await ejs.renderFile(templateFile, data || {}, {
      root: VIEWS_DIR,
      views: [VIEWS_DIR],
    });

    const outFile = path.join(GENERATED_DIR, `${outputName}.html`);
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, html, "utf8");

    res.json({
      success: true,
      message: "Custom page generated",
      page: {
        template,
        outputName,
        path: outFile,
        url: `/generated/${outputName}.html`,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const listGeneratedPages = async (req, res, next) => {
  try {
    try {
      await fs.access(GENERATED_DIR);
    } catch {
      return res.json({ success: true, pages: [], totalPages: 0 });
    }

    const files = (await fs.readdir(GENERATED_DIR)).filter((f) =>
      f.endsWith(".html"),
    );
    const pages = [];
    for (const f of files) {
      const stat = await fs.stat(path.join(GENERATED_DIR, f));
      pages.push({
        name: f,
        path: path.join(GENERATED_DIR, f),
        url: `/generated/${f}`,
        size: stat.size,
        lastModified: stat.mtime,
      });
    }

    res.json({ success: true, pages, totalPages: pages.length });
  } catch (err) {
    next(err);
  }
};

export const deleteGeneratedPage = async (req, res, next) => {
  try {
    const { filename } = req.params;
    if (!filename)
      return res.status(400).json({ message: "filename is required" });

    const file = path.join(GENERATED_DIR, filename);
    try {
      await fs.access(file);
    } catch {
      return res.status(404).json({ message: "File not found" });
    }

    await fs.unlink(file);
    res.json({ success: true, message: `Deleted ${filename}` });
  } catch (err) {
    next(err);
  }
};

export const clearAllGeneratedPages = async (req, res, next) => {
  try {
    try {
      await fs.access(GENERATED_DIR);
    } catch {
      return res.json({
        success: true,
        message: "No generated pages to delete",
        deletedFiles: [],
      });
    }

    const files = (await fs.readdir(GENERATED_DIR)).filter((f) =>
      f.endsWith(".html"),
    );
    for (const f of files) {
      await fs.unlink(path.join(GENERATED_DIR, f));
    }

    res.json({
      success: true,
      message: `Deleted ${files.length} generated pages`,
      deletedFiles: files,
    });
  } catch (err) {
    next(err);
  }
};
