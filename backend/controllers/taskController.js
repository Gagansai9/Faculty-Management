const Task = require('../models/taskModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin/HOD
const createTask = async (req, res) => {
    const { title, description, assignedTo, deadline } = req.body;

    if (req.user.role !== 'admin' && req.user.role !== 'hod') {
        return res.status(403).json({ message: 'Not authorized to assign tasks' });
    }

    try {
        const task = await Task.create({
            id: uuidv4(),
            title,
            description,
            assignedToId: assignedTo,
            assignedById: req.user.id,
            deadline,
            status: 'Pending',
            progress: 0
        });

        // Fetch to return full object if needed, or structured response
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin' || req.user.role === 'hod') {
            // Admin/HOD see all tasks (or Department specific for HOD - simplified to All for now)
            tasks = await Task.findAll({
                include: [
                    { model: User, as: 'assignedUser', attributes: ['id', 'name'] },
                    { model: User, as: 'creatorUser', attributes: ['id', 'name'] }
                ]
            });
        } else {
            // Lecturers see only their tasks
            tasks = await Task.findAll({
                where: { assignedToId: req.user.id },
                include: [
                    { model: User, as: 'assignedUser', attributes: ['id', 'name'] },
                    { model: User, as: 'creatorUser', attributes: ['id', 'name'] }
                ]
            });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task status and progress
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
    const { status, progress } = req.body;

    try {
        const task = await Task.findByPk(req.params.id);

        if (task) {
            if (status) task.status = status;
            if (progress !== undefined) task.progress = progress;

            // Auto-update status based on progress if not explicitly set
            if (task.progress === 100 && task.status !== 'Completed') task.status = 'Completed';
            if (task.progress > 0 && task.progress < 100 && task.status === 'Pending') task.status = 'In Progress';

            await task.save();
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, updateTaskStatus };
