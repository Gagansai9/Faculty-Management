const PDFDocument = require('pdfkit');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const Leave = require('../models/leaveModel');

// @desc    Generate Faculty Report
// @route   GET /api/faculty/reports/:userId
// @access  Private (HOD/Admin)
const generateFacultyReport = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const tasks = await Task.findAll({ where: { assignedToId: userId } });
        const createdTasks = await Task.findAll({ where: { assignedById: userId } });
        const leaves = await Leave.findAll({ where: { userId: userId } });

        const doc = new PDFDocument();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report_${user.name.replace(/\s+/g, '_')}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('Faculty Performance Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
        doc.moveDown();

        // User Profile
        doc.rect(50, 100, 510, 80).stroke();
        doc.fontSize(14).text(`Name: ${user.name}`, 60, 110);
        doc.text(`Role: ${user.role.toUpperCase()}`, 60, 130);
        doc.text(`Department: ${user.department || 'N/A'}`, 60, 150);
        doc.text(`Email: ${user.email}`, 60, 170);

        doc.moveDown(5);

        // Task Statistics
        doc.fontSize(16).text('Task Analytics', { underline: true });
        doc.moveDown();
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const totalTasks = tasks.length;
        const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

        doc.fontSize(12).text(`Tasks Assigned To User: ${totalTasks}`);
        doc.text(`Tasks Completed: ${completedTasks}`);
        doc.text(`Completion Rate: ${completionRate}%`);
        doc.moveDown();

        // Task List
        doc.fontSize(14).text('Assigned Tasks Details', { underline: true });
        doc.moveDown();

        tasks.forEach((task, index) => {
            doc.fontSize(12).text(`${index + 1}. ${task.title} - [${task.status}] (${task.progress}%)`);
            doc.fontSize(10).text(`   Due: ${task.deadline}`);
            doc.moveDown(0.5);
        });

        doc.moveDown();

        // Leave Statistics
        doc.fontSize(16).text('Leave History', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(`Total Leave Requests: ${leaves.length}`);
        doc.text(`Approved: ${leaves.filter(l => l.status === 'Approved').length}`);
        doc.moveDown();

        leaves.forEach((leave, index) => {
            doc.fontSize(12).text(`${index + 1}. ${leave.reason} (${leave.status})`);
            doc.fontSize(10).text(`   ${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}`);
            doc.moveDown(0.5);
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateFacultyReport };
