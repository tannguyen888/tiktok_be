// TODO: import mongoose
const mongoose = require('mongoose');
// TODO: videoSchema gồm các fields:
//   - title: String, required
//   - description: String, default ''
//   - videoUrl: String, required
//   - user: ObjectId ref User, required
//   - views: Number, default 0
//   - timestamps: true
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });


// TODO: module.exports = mongoose.model('Video', videoSchema)
module.exports  = mongoose.model('Video', videoSchema);