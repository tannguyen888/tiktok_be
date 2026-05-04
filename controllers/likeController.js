const likeModel = require('../models/likeModel');

const toggleLike = async (req, res) => {
  try {
    const existingLike = await likeModel.findOne({
      video: req.params.videoId,
      user: req.user.userId
    });

    //  nếu đã like → unlike
    if (existingLike) {
      await likeModel.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: 'Video unliked' });
    }

    //  nếu chưa like → tạo mới
    await likeModel.create({
      video: req.params.videoId,
      user: req.user.userId
    });

    return res.status(200).json({ message: 'Video liked' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getLikes = async (req, res) => {
  try {
    const likes = await likeModel.find({ video: req.params.videoId });
    res.status(200).json({ likesCount: likes.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  toggleLike,
  getLikes
};