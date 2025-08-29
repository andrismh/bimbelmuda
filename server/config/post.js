import mongoose from './db.js';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    }
});

const Post = mongoose.models.Post;

export default Post;