// post.js
import mongoose from "mongoose"; // or import the same mongoose instance you use to connect

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "blogContents",
  }
);

// Reuse if already compiled (prevents OverwriteModelError in dev/hot-reload)
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
