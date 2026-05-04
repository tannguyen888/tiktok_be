// TODO: import mongoose
const mongoose = require('mongoose');

// TODO: userSchema gồm các fields:
//   - username: String, required, unique
//   - email: String, required, unique, lowercase
//   - password: String
//   - avatar: String, default ''
//   - bio: String, default ''
//   - followers: [ObjectId ref User]
//   - following: [ObjectId ref User]
//   - timestamps: true
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true

    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        default: ''
    },
    bio:{
        type: String,
        default: ''},
    followers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}
, { timestamps: true });
// TODO: module.exports = mongoose.model('User', userSchema)
module.exports = mongoose.model('User', userSchema);