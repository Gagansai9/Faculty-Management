const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, applyLeave, getMyLeaves, getAllFaculty } = require('../controllers/facultyController');
const { generateFacultyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/profile').get(getProfile).put(updateProfile);
router.post('/leave', applyLeave);
router.get('/leaves', getMyLeaves);
router.get('/all', getAllFaculty);
router.get('/reports/:userId', generateFacultyReport);

module.exports = router;
