const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isApproved) {
                return res.status(403).json({ message: 'Account pending approval. Please contact administrator.' });
            }
            res.json({
                _id: user.id, // Frontend expects _id
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Public registration cannot make Admins
        const requestedRole = role === 'admin' ? 'lecturer' : role;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: requestedRole || 'lecturer',
            department: req.body.department || null,
            isApproved: false // Self-registered users are NOT approved by default
        });

        if (user) {
            // Do NOT return token. Force them to wait for approval.
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                message: 'Registration successful. Account pending approval.'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authUser, registerUser };
