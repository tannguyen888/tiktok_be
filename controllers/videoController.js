// TODO: import Video model
const videoModel = require('../models/videoModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
   return mongoose.Types.ObjectId.isValid(id);
};

// TODO: uploadVideo - nhận title, description, req.file (từ multer) -> lưu video vào DB với videoUrl = /uploads/filename
const uploadVideo = async (req, res) => {
   try {
      const { title, description } = req.body || {};
      
      // Validation
      if (!title || !description) {
         return res.status(400).json({ message: 'Title and description are required' });
      }
      
      if (!req.file) {
         return res.status(400).json({ message: 'Video file is required' });
      }
      
      if (!req.user || !req.user.userId) {
         return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const videoUrl = `/uploads/${req.file.filename}`;
      const userId = req.user.userId;
      
      const allInfoVideo = new videoModel({
         title,
         description,
         videoUrl,
         user: userId,
      });
      
      await allInfoVideo.save();
      res.status(201).json({ 
         message: 'Video uploaded successfully', 
         video: allInfoVideo 
      });
   } catch (err) {
      console.error('Error in uploadVideo:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
   }
};

// TODO: getVideos - lấy tất cả video, populate user (username), sắp xếp mới nhất trước
const getVideos = async (req, res) => {
   try {
      const videos = await videoModel.find()
         .populate('user', 'username')
         .sort({ createdAt: -1 });
      res.status(200).json({ videos });
   } catch (err) {
      console.error('Error in getVideos:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
   }
};

// TODO: getVideoById - tìm video theo req.params.id, populate user
const getVideoById = async (req, res) => {
   try {
      const videoId = req.params.id;
      
      if (!videoId || !isValidObjectId(videoId)) {
         return res.status(400).json({ message: 'Invalid video id format' });
      }
      
      const findVideoByid = await videoModel.findById(videoId).populate('user', 'username');
      if (!findVideoByid) {
         return res.status(404).json({ message: 'Video not found' });
      }
      res.status(200).json({ video: findVideoByid });
   } catch (err) {
      console.error('Error in getVideoById:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
   }
};

// TODO: deleteVideo - tìm video -> kiểm tra quyền sở hữu -> xóa
const deleteVideo = async (req, res) => {
   try {
      const videoId = req.params.id;
      
      if (!videoId || !isValidObjectId(videoId)) {
         return res.status(400).json({ message: 'Invalid video id format' });
      }
      
      if (!req.user || !req.user.userId) {
         return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const findVideo = await videoModel.findById(videoId).populate('user', '_id');
      if (!findVideo) {
         return res.status(404).json({ message: 'Video not found' });
      }
      
      if (findVideo.user._id.toString() !== req.user.userId) {
         return res.status(403).json({ message: 'Unauthorized - you can only delete your own videos' });
      }
      
      await videoModel.findByIdAndDelete(videoId);
      res.status(200).json({ message: 'Video deleted successfully' });
   } catch (err) {
      console.error('Error in deleteVideo:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
   }
};
// TODO: module.exports = { uploadVideo, getVideos, getVideoById, deleteVideo }
module.exports = {
   uploadVideo,
   getVideos,
   getVideoById,
   deleteVideo
};