const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const User = require('../model/user'); // make sure path is correct

const userMiddleware = async (req, res, next) => {
  try {
    // ✅ extract token string from cookie
    const token = req.cookies?.token; 

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // ✅ verify token (must be string)
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = payload;
    if (!_id) {
      return res.status(401).json({ message: 'Unauthorized: ID missing in token' });
    }

    // ✅ ensure user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // ✅ check if token is blacklisted in Redis
    const isBlocked = await redisClient.get(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({ message: 'Unauthorized: Token is blocked' });
    }

    // ✅ attach user object to request for later use
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT auth error:', err.message);
    res.status(401).json({
      message: 'Unauthorized: Invalid token',
      error: err.message,
    });
  }
};

module.exports = userMiddleware;
