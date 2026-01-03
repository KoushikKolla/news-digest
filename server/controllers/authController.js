const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Registering user:', email); // Debug log

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.create({
            email,
            password,
        });

        console.log('User created:', user._id); // Debug log

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
            topics: user.topics,
            isSubscribed: user.isSubscribed,
        });
    } catch (error) {
        console.error('Registration Error Details:', error); // Critical Debug Log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
                topics: user.topics,
                isSubscribed: user.isSubscribed,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error Details:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
