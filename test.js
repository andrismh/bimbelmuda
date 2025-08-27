import mongoose from "mongoose";
import Post from './models/Post.js';

mongoose.connect('mongodb://127.0.0.1:27017/blogSSG').then(async () => {
  await Post.create({
    title: "Programmatic Post",
    slug: "programmatic-post",
    content: "This was inserted using code!",
  });
  console.log("Post added.");
  process.exit();
});
