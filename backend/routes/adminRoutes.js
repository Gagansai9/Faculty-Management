const express = require('express');
const router = express.Router();
const { getUsers, createUser, getAllLeaves, updateLeaveStatus, updateUser, deleteUser, generateReport, approveUser, disapproveUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.put('/users/:id/approve', approveUser);
router.put('/users/:id/disapprove', disapproveUser);

router.get('/leaves', getAllLeaves);
router.put('/leaves/:id', updateLeaveStatus);
router.post('/reports', generateReport);

module.exports = router;
