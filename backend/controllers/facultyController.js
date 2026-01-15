const User = require('../models/userModel');
const Leave = require('../models/leaveModel');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// @desc    Get user profile
// @route   GET /api/faculty/profile
// @access  Private
const getProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            designation: user.designation,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/faculty/profile
// @access  Private
const updateProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.department = req.body.department || user.department;
        user.designation = req.body.designation || user.designation;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
            designation: updatedUser.designation,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Apply for leave
// @route   POST /api/faculty/leave
// @access  Private
const applyLeave = async (req, res) => {
    const { reason, startDate, endDate } = req.body;

    try {
        const leave = await Leave.create({
            id: uuidv4(),
            userId: req.user.id,
            reason,
            startDate,
            endDate,
            status: 'Pending'
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my leaves
// @route   GET /api/faculty/leaves
// @access  Private
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.findAll({ where: { userId: req.user.id } });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all faculty members (for HOD/Admin)
// @route   GET /api/faculty/all
// @access  Private
const getAllFaculty = async (req, res) => {
    try {
        // Fetch all users except strictly 'admin' to avoid clutter, or fetch all.
        // HODs should ideally only see their department, but for now we show all faculty.
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'department', 'role']
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile, applyLeave, getMyLeaves, getAllFaculty };
