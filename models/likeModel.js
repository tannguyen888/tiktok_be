// TODO: import mongoose
const mongoose = require('mongoose');

// TODO: likeSchema gồm các fields:
//   - video: ObjectId ref Video, required
//   - user: ObjectId ref User, required
//   - timestamps: true
//   - index unique trên (video + user) để tránh like 2 lần
const likeSchema = new mongoose.Schema({
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{ timestamps: true },
);   

likeSchema.index({ video: 1, user: 1 }, { unique: true });
// TODO: module.exports = mongoose.model('Like', likeSchema)
module.exports = mongoose.model('Like', likeSchema);
