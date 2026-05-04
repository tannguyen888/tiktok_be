// TODO: import User model, bcryptjs, jsonwebtoken
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// TODO: register - nhận username, email, password -> hash password -> lưu vào DB -> trả về userId
const register = async (req, res) => {
   const { username, email, password } = req.body;
   try {
      const findUser = await userModel.findOne({
         $or: [{ email }, { username }]
      });
      if (findUser) {
         return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
         username,
         email,
         password: hashedPassword
      });
      const savedUser = await newUser.save();
      res.status(201).json({ userId: savedUser._id });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: login - tìm user theo email -> so sánh password -> tạo JWT token -> trả về token + user info
const login = async (req, res) => {
   const { email, password } = req.body;
   try {
      const findUser = await userModel.findOne({ email });
      if (!findUser) {
         return res.status(400).json({ message: 'Invalid email or password' });
      }
      const isPasswordValid = await bcrypt.compare(password, findUser.password);
      if (!isPasswordValid) {
         return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ 
         token, 
         user: { 
            id: findUser._id, 
            username: findUser.username, 
            email: findUser.email 
         } 
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: getProfile - lấy thông tin user từ req.user.userId (đã qua authMiddleware) -> trả về user (bỏ password)
const getProfile = async (req, res) => {
   try {
      const user = await userModel.findById(req.user.userId).select('-password');
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: module.exports = { register, login, getProfile }
module.exports = {
   register,
   login,
   getProfile
};