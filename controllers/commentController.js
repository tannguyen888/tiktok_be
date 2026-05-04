// TODO: import Comment model
const Comment = require('../models/commentModel');

// TODO: addComment - nhận content từ req.body -> tạo comment với video và user -> populate user
const addComment = async (req, res) => {
   const content = req.body.content;
   const comment = new Comment({
      video: req.params.videoId,
      user: req.user.userId,
      content: content
   })
   try {
      const savedComment = await comment.save();
      const populatedComment = await savedComment.populate('user', 'username');
      res.status(201).json(populatedComment);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
   }
}
// TODO: getComments - lấy tất cả comment của video theo videoId, populate user, sắp xếp mới nhất trước 
const getComments = async (req, res) => {
   try {
      const comments = await Comment.find({ video: req.params.videoId })
         .populate('user', 'username')
         .sort({ createdAt: -1 });
      res.status(200).json(comments);
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
   }
}
// TODO: deleteComment - tìm comment -> kiểm tra quyền sở hữu -> xóa
const deleteComment = async (req, res) => {
   try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
         return res.status(404).json({ message: 'Comment not found' });
      }
      const userId = req.user.userId;
      if (comment.user.toString() === userId) {
         await Comment.findByIdAndDelete(req.params.id);
         return res.status(200).json({ message: 'Comment deleted' });
      } else {
         return res.status(403).json({ message: 'Unauthorized' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
   }
}
// TODO: module.exports = { addComment, getComments, deleteComment }
module.exports = {
   addComment,
   getComments,
   deleteComment
};
