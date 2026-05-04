// TODO: import Video model
const videoModel = require('../models/videoModel');
const userModel = require('../models/userModel');
// TODO: uploadVideo - nhận title, description, req.file (từ multer) -> lưu video vào DB với videoUrl = /uploads/filename
const uploadVideo = async (req, res) => {
   const { title, description } = req.body;
   const videoUrl = `/uploads/${req.file.filename}`;
   const userId = req.user.userId;
   try {
      const allInfoVideo = new videoModel({
         title,
         description,
         videoUrl,
         user: userId,
      });
      await allInfoVideo.save();
      res.status(201).json({ message: 'Video uploaded successfully', video: allInfoVideo });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: getVideos - lấy tất cả video, populate user (username), sắp xếp mới nhất trước
const getVideos = async (req, res) => {
   try {
      const videos = await videoModel.find()
         .populate('user', 'username')
         .sort({ createdAt: -1 });
      res.status(200).json({ videos });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: getVideoById - tìm video theo req.params.id, populate user
const getVideoById = async (req, res) => {
   try {
      const findVideoByid = await videoModel.findById(req.params.id).populate('user', 'username');
      if (!findVideoByid) {
         return res.status(404).json({ message: 'Video not found' });
      }
      res.status(200).json({ video: findVideoByid });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: deleteVideo - tìm video -> kiểm tra quyền sở hữu -> xóa
const deleteVideo = async (req, res) => {
   try {
      const findVideo = await videoModel.findById(req.params.id).populate('user', '_id');
      if (!findVideo) {
         return res.status(404).json({ message: 'Video not found' });
      }
      if (findVideo.user._id.toString() !== req.user.userId) {
         return res.status(403).json({ message: 'Unauthorized' });
      }
      await videoModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Video deleted successfully' });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: module.exports = { uploadVideo, getVideos, getVideoById, deleteVideo }
module.exports = {
   uploadVideo,
   getVideos,
   getVideoById,
   deleteVideo
};