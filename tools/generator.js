import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import expressLayout from "express-ejs-layouts";
import ejs from "ejs";
import Post from "../server/config/post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine to implement ejs
app.use(expressLayout);
app.use(
  "layout",
  path.join(path.dirname(__dirname), "../", "views/layout/main")
);
app.set("view engine", "ejs");
app.set("views", path.join(path.dirname(__dirname), "../", "views"));

// Exported function that does the static generation
export default async function generateStaticPosts() {
  const posts = await Post.find(); // Get all posts from MongoDB

  const templatePath = path.join(__dirname, "views", "post.ejs");

  // Load EJS template only once
  const template = fs.readFileSync(templatePath, "utf-8");

  // Ensure public folder exists
  const outputDir = path.join(__dirname, "../public/static/writings");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Generate one .html file per post
  for (const post of posts) {
    const html = ejs.render(template, { post }); // Render HTML with post data
    const filePath = path.join(outputDir, `${post.slug}.html`);
    fs.writeFileSync(filePath, html); // Save HTML file
  }

  console.log("✅ Static HTML files generated successfully.");
}
