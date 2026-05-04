// TODO: import express, userController, authMiddleware
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
// TODO: POST /register -> register
// TODO: POST /login    -> login
// TODO: GET  /profile  -> authMiddleware, getProfile
const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
// TODO: module.exports = router


module.exports = router;