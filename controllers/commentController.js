// TODO: import Comment model
const Comment = require('../models/commentModel');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
   return mongoose.Types.ObjectId.isValid(id);
};

// TODO: addComment - nhận content từ req.body -> tạo comment với video và user -> populate user
const addComment = async (req, res) => {
   try {
      const { content } = req.body || {};
      const videoId = req.params.videoId;
      
      // Validation
      if (!content) {
         return res.status(400).json({ message: 'Content is required' });
      }
      
      if (!videoId || !isValidObjectId(videoId)) {
         return res.status(400).json({ message: 'Invalid videoId' });
      }
      
      if (!req.user || !req.user.userId) {
         return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const comment = new Comment({
         video: videoId,
         user: req.user.userId,
         content: content
      });
      
      const savedComment = await comment.save();
      const populatedComment = await savedComment.populate('user', 'username');
      res.status(201).json(populatedComment);
   } catch (error) {
      console.error('Error in addComment:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
   }
};

// TODO: getComments - lấy tất cả comment của video theo videoId (path param hoặc query), populate user, sắp xếp mới nhất trước 
const getComments = async (req, res) => {
   try {
      // Support both path parameter and query parameter
      const videoId = req.params.videoId || req.query.videoId;
      
      if (!videoId) {
         return res.status(400).json({ message: 'videoId is required' });
      }
      
      if (!isValidObjectId(videoId)) {
         return res.status(400).json({ message: 'Invalid videoId format' });
      }
      
      const comments = await Comment.find({ video: videoId })
         .populate('user', 'username')
         .sort({ createdAt: -1 });
      
      res.status(200).json(comments);
   } catch (error) {
      console.error('Error in getComments:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
   }
};

// TODO: deleteComment - tìm comment -> kiểm tra quyền sở hữu -> xóa
const deleteComment = async (req, res) => {
   try {
      const commentId = req.params.id;
      
      if (!commentId || !isValidObjectId(commentId)) {
         return res.status(400).json({ message: 'Invalid comment id' });
      }
      
      const comment = await Comment.findById(commentId);
      if (!comment) {
         return res.status(404).json({ message: 'Comment not found' });
      }
      
      const userId = req.user.userId;
      if (comment.user.toString() !== userId) {
         return res.status(403).json({ message: 'Unauthorized - you can only delete your own comments' });
      }
      
      await Comment.findByIdAndDelete(commentId);
      return res.status(200).json({ message: 'Comment deleted successfully' });
   } catch (error) {
      console.error('Error in deleteComment:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
   }
};
// TODO: module.exports = { addComment, getComments, deleteComment }
module.exports = {
   addComment,
   getComments,
   deleteComment
};
