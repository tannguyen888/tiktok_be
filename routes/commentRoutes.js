// TODO: import express, commentController, authMiddleware
const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
// TODO: GET    /:videoId -> getComments
// TODO: POST   /:videoId -> authMiddleware, addComment
// TODO: DELETE /:id      -> authMiddleware, deleteComment
const router = express.Router();
router.get('/:videoId', commentController.getComments);
router.post('/:videoId', authMiddleware, commentController.addComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

// TODO: module.exports = router
module.exports = router;