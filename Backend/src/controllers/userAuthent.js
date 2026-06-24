const User = require('../model/user');
const validate=require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');

const register =async (req, res) => {
    try{

        // validate the data
        validate(req.body);

        // Destructure the validated data
        const { firstName, email, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set user role to 'user' by default
        req.body.role = 'user';

        // Create the user
        const user = await User.create({ firstName, email, password: hashedPassword });
        // Generate JWT token
        const token = jwt.sign({ _id: user._id, email: email, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Set the token as a cookie
        res.cookie('token', token, {maxAge: 3600000, httpOnly: true});
        
        res.status(201).json({ message: 'User registered successfully', token });
    }
    catch(err){
        res.status(400).json({ message: 'Internal server error in Registration', error: err.message });
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        // Validate input
        if(!email){
            return res.status(400).json({ message: 'Email is required' });
        }
        if(!password){
            return res.status(400).json({ message: 'Password is required' });
        }
        // Find the user
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ _id: user._id, email: email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Set the token as a cookie
        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        res.status(200).send({ message: 'Login successful', token });
    }
    catch(err){
        res.status(500).send({ message: 'Internal server error' ,error: err.message});
    }
}

const logout = async (req, res) => {
    try {
        // Clear the cookie
        // res.clearCookie('token');
        // res.status(200).json({ message: 'Logout successful' });

        const { token } = req.cookies;
        const payload = jwt.decode(token);
        // token add on redis blocklist
        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        // Set cookie to expire immediately
        res.cookie('token',null,{expires: new Date(Date.now())});
        res.status(200).json({ message: 'Logout successful' });

    } catch (err) {
        res.status(401).send({ message: 'Unauthorized: Invalid token', error: err.message });
    }
}

const adminRegister = async (req, res) => {
    try{

        // validate the data
        validate(req.body);

        // Destructure the validated data
        const { firstName, email, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set user role to 'user' by default
        // req.body.role = 'admin';

        // Create the user
        const user = await User.create({ firstName, email, password: hashedPassword, role: 'admin' });
        // Generate JWT token
        const token = jwt.sign({ _id: user._id, email: email, role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Set the token as a cookie
        res.cookie('token', token, {maxAge: 3600000, httpOnly: true});
        
        res.status(201).json({ message: 'User registered successfully', token });
    }
    catch(err){
        res.status(400).json({ message: 'Internal server error in Registration', error: err.message });
    }
}

const getProfile = (req, res) => {
    res.status(200).json({ user: req.user });
}



module.exports = { register, login, logout, getProfile, adminRegister };
