// TODO: import mongoose
const mongoose = require('mongoose');

// TODO: commentSchema gồm các fields:
//   - content: String, required
//   - video: ObjectId ref Video, required
//   - user: ObjectId ref User, required
//   - timestamps: true
const commentSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true  },
    video: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Video', 
        required: true },
    user: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
}, { timestamps: true });

// TODO: module.exports = mongoose.model('Comment', commentSchema)
module.exports = mongoose.model('Comment', commentSchema);