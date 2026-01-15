const User = require('../models/userModel');
const Leave = require('../models/leaveModel');
const PDFDocument = require('pdfkit');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, department, designation } = req.body;
    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            role, // 'admin', 'hod', 'lecturer'
            department,
            designation
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all leave requests
// @route   GET /api/admin/leaves
// @access  Private/Admin
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.findAll({
            include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update leave status
// @route   PUT /api/admin/leaves/:id
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
    const { status, adminComment } = req.body;

    try {
        const leave = await Leave.findByPk(req.params.id);

        if (leave) {
            leave.status = status || leave.status;
            leave.adminComment = adminComment || leave.adminComment;
            await leave.save();

            const populatedLeave = await Leave.findByPk(leave.id, {
                include: [{ model: User, attributes: ['id', 'name', 'email'] }]
            });
            res.json(populatedLeave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.department = req.body.department || user.department;

            const updatedUser = await user.save();
            res.json({
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (user) {
            await user.destroy();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate System Report
// @route   POST /api/admin/reports
// @access  Private/Admin
const generateReport = async (req, res) => {
    try {
        const users = await User.findAll();
        const leaves = await Leave.findAll();
        const tasks = await require('../models/taskModel').findAll(); // Late require to avoid circular dependency in some patterns

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=system_report.pdf');

        doc.pipe(res);

        doc.fontSize(25).text('University System Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`Date: ${new Date().toLocaleString()}`);
        doc.moveDown();

        // Stats
        doc.fontSize(18).text('Personnel Stats');
        doc.fontSize(12).text(`Total Users: ${users.length}`);
        doc.text(`Admins: ${users.filter(u => u.role === 'admin').length}`);
        doc.text(`HODs: ${users.filter(u => u.role === 'hod').length}`);
        doc.text(`Lecturers: ${users.filter(u => u.role === 'lecturer').length}`);
        doc.moveDown();

        doc.fontSize(18).text('Workflow Stats');
        doc.text(`Total Tasks: ${tasks.length}`);
        doc.text(`Pending Tasks: ${tasks.filter(t => t.status === 'Pending').length}`);
        doc.text(`Completed Tasks: ${tasks.filter(t => t.status === 'Completed').length}`);
        doc.moveDown();

        doc.fontSize(18).text('Leave Stats');
        doc.text(`Pending Requests: ${leaves.filter(l => l.status === 'Pending').length}`);
        doc.text(`Approved: ${leaves.filter(l => l.status === 'Approved').length}`);

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, createUser, getAllLeaves, updateLeaveStatus, updateUser, deleteUser, generateReport };
