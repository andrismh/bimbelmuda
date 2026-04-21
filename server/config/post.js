import mongoose from "mongoose";
import slugify from "slugify";
import { stripMarkdown } from "../utils/renderMarkdown.js";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    excerpt: { type: String },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: { type: Date },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    collection: "blogContents",
  },
);

postSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (!this.excerpt && this.content) {
    this.excerpt = stripMarkdown(this.content).slice(0, 150);
  }

  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
