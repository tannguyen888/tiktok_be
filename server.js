//import thu vien
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const server = express();

//middleware
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
server.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// CORS configuration
server.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', '*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files (uploads folder)
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security headers (without blocking connections)
server.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

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

// API info endpoint
server.get('/api', (req, res) => {
    res.status(200).json({
        message: 'TikTok API',
        version: '1.0.0',
        routes: {
            users: '/api/users (register, login, profile)',
            videos: '/api/videos (upload, get all, get by id, delete)',
            comments: '/api/comments/:videoId (add, get, delete)',
            likes: '/api/likes/:videoId (toggle, get count)',
            health: '/health'
        },
        documentation: 'See POSTMAN_TESTING.md for detailed API documentation'
    });
});

// Health check endpoint
server.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
server.use((req, res) => {
    res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handling middleware
server.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ 
        message: err.message || 'Server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

//start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
}); 

