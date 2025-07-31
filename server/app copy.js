import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./mongo.js";
import generateStaticPosts from "./generator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Connect to MongoDB
await connectDB();

// Run static site generator to build HTML files
await generateStaticPosts();

// Serve the static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Optional: basic route
app.get("/", (req, res) => {
  res.send("Static blog site is running. Visit /[slug].html to see pages.");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
