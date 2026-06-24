const express = require('express');
const authRouter = express.Router();

const { register, login, logout, getProfile, adminRegister } = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/usermiddleware');
const adminMiddleware = require('../middleware/adminmiddleware');

// Register
authRouter.post('/register', register);

// Login
authRouter.post('/login', login);

// Logout
authRouter.post('/logout', userMiddleware, logout);

// admin register
authRouter.post('/admin/register', adminMiddleware, adminRegister);

// Get user profile
authRouter.get('/profile', userMiddleware, getProfile);

module.exports = authRouter;
