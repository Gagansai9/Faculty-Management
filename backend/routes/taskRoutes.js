const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTaskStatus);

module.exports = router;
