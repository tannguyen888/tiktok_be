const likeModel = require('../models/likeModel');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
   return mongoose.Types.ObjectId.isValid(id);
};

const toggleLike = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user.userId;
    
    // Validation
    if (!videoId || !isValidObjectId(videoId)) {
      return res.status(400).json({ message: 'Invalid videoId format' });
    }
    
    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    
    const existingLike = await likeModel.findOne({
      video: videoId,
      user: userId
    });

    //  nếu đã like → unlike
    if (existingLike) {
      await likeModel.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: 'Video unliked' });
    }

    //  nếu chưa like → tạo mới
    await likeModel.create({
      video: videoId,
      user: userId
    });

    return res.status(201).json({ message: 'Video liked' });

  } catch (error) {
    console.error('Error in toggleLike:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getLikes = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    
    if (!videoId || !isValidObjectId(videoId)) {
      return res.status(400).json({ message: 'Invalid videoId format' });
    }
    
    const likes = await likeModel.find({ video: videoId });
    res.status(200).json({ 
      likesCount: likes.length,
      message: `${likes.length} like(s) on this video`
    });
  } catch (error) {
    console.error('Error in getLikes:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  toggleLike,
  getLikes
};