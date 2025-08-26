import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tags: {
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

const Post = mongoose.model('Post', postSchema);

export default Post;