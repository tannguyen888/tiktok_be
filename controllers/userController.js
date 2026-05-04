// TODO: import User model, bcryptjs, jsonwebtoken
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Validation helper
const validateEmail = (email) => {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email);
};

// TODO: register - nhận username, email, password -> hash password -> lưu vào DB -> trả về userId
const register = async (req, res) => {
   try {
      const { username, email, password } = req.body || {};
      
      // Validation
      if (!username || !email || !password) {
         return res.status(400).json({ 
            message: 'Missing required fields',
            required: ['username', 'email', 'password']
         });
      }

      if (username.length < 3) {
         return res.status(400).json({ message: 'Username must be at least 3 characters' });
      }

      if (!validateEmail(email)) {
         return res.status(400).json({ message: 'Invalid email format' });
      }

      if (password.length < 6) {
         return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      const findUser = await userModel.findOne({
         $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
      });
      
      if (findUser) {
         return res.status(400).json({ message: 'Username or email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
         username: username.trim(),
         email: email.toLowerCase(),
         password: hashedPassword
      });
      
      const savedUser = await newUser.save();
      res.status(201).json({ 
         message: 'User registered successfully',
         userId: savedUser._id 
      });
   } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
   }
}

// TODO: login - tìm user theo email -> so sánh password -> tạo JWT token -> trả về token + user info
const login = async (req, res) => {
   try {
      const { email, password } = req.body || {};
      
      // Validation
      if (!email || !password) {
         return res.status(400).json({ 
            message: 'Missing required fields',
            required: ['email', 'password']
         });
      }

      const findUser = await userModel.findOne({ email: email.toLowerCase() });
      
      if (!findUser) {
         return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, findUser.password);
      
      if (!isPasswordValid) {
         return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.status(200).json({ 
         message: 'Login successful',
         token, 
         user: { 
            id: findUser._id, 
            username: findUser.username, 
            email: findUser.email 
         } 
      });
   } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error' });
   }
}

// TODO: getProfile - lấy thông tin user từ req.user.userId (đã qua authMiddleware) -> trả về user (bỏ password)
const getProfile = async (req, res) => {
   try {
      if (!req.user || !req.user.userId) {
         return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }

      const user = await userModel.findById(req.user.userId).select('-password');
      
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ 
         message: 'Profile retrieved successfully',
         user 
      });
   } catch (err) {
      console.error('Get profile error:', err);
      res.status(500).json({ message: 'Server error' });
   }
}
// TODO: module.exports = { register, login, getProfile }
module.exports = {
   register,
   login,
   getProfile
};