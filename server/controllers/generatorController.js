import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import ejs from "ejs";
import Post from "../config/post";

const ROOT = process.cwd();
const VIEWS = path.join(ROOT, "views");
const OUT_DIR = path.join(ROOT, "public/writings");

export const generateAllPages = async (req, res) => {
    const posts = await Post.find().lean();
    const buildHtml = await ejs.renderFile()
    return res.json(posts);
};