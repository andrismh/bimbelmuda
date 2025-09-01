import path from "path";
import { fileURLToPath } from "url";

// Re-create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getHomePage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/index.html"));
};

export function getProjectsPage(req, res) {
  res.sendFile("/#projects");
};

export function getWritingsPage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/writings.html"));
};

export function getCreatePostPage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/create-post.html"));
};


export function getAboutPage(req, res) {
  res.sendFile(path.join(__dirname, "../../public/static/about.html"));
};