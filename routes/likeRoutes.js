// TODO: import express, likeController, authMiddleware
const express = require('express');
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');
// TODO: POST /:videoId -> authMiddleware, toggleLike
// TODO: GET  /:videoId -> getLikes
const router = express.Router();
router.post('/:videoId', authMiddleware, likeController.toggleLike);
router.get('/:videoId', likeController.getLikes);
// TODO: module.exports = router


module.exports = router;