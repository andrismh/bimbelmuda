import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";
import Post from "./models/Post.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exported function that does the static generation
export default async function generateStaticPosts() {
  const posts = await Post.find(); // Get all posts from MongoDB

  const templatePath = path.join(__dirname, "views", "post.ejs");

  // Load EJS template only once
  const template = fs.readFileSync(templatePath, "utf-8");

  // Ensure public folder exists
  const outputDir = path.join(__dirname, "public/writings");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  // Generate one .html file per post
  for (const post of posts) {
    const html = ejs.render(template, { post }); // Render HTML with post data
    const filePath = path.join(outputDir, `${post.slug}.html`);
    fs.writeFileSync(filePath, html);            // Save HTML file
  }

  console.log("✅ Static HTML files generated successfully.");
}
