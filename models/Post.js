import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/bimbel-muda')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A post must have a title.'],
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Post content cannot be empty.']
  },
  slug: {
    type: String,
    required: [true, 'A post must have a slug'],
    unique: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);
export default Post;