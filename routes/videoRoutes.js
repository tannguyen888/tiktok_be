// TODO: import express, multer, videoController, authMiddleware
const express = require('express');
const multer = require('multer');
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
// TODO: cấu hình multer diskStorage -> lưu file vào thư mục uploads/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });
const router = express.Router();
// TODO: GET  /           -> getVideos
// TODO: GET  /:id        -> getVideoById
// TODO: POST /           -> authMiddleware, upload.single('video'), uploadVideo
// TODO: DELETE /:id      -> authMiddleware, deleteVideo
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', authMiddleware, upload.single('video'), videoController.uploadVideo);
router.delete('/:id', authMiddleware, videoController.deleteVideo);
// TODO: module.exports = router


module.exports = router;