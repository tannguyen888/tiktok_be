//import thu vien
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const server = express();

//middleware
server.use(express.json());
server.use(cors());

//connect db
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
})

//import routes
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');    
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');

server.use('/api/users', userRoutes);
server.use('/api/videos', videoRoutes);
server.use('/api/comments', commentRoutes);
server.use('/api/likes', likeRoutes);

//start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

