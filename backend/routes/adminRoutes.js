const express = require('express');
const router = express.Router();
const { getUsers, createUser, getAllLeaves, updateLeaveStatus, updateUser, deleteUser, generateReport } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.get('/leaves', getAllLeaves);
router.put('/leaves/:id', updateLeaveStatus);
router.post('/reports', generateReport);

module.exports = router;
