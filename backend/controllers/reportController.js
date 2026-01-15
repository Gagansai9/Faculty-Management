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
        const leaves = await Leave.findAll({ where: { userId: userId } });

        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Faculty_Report_${user.name.replace(/\s+/g, '_')}.pdf`);

        doc.pipe(res);

        // --- STYLING CONSTANTS ---
        const PRIMARY_COLOR = '#0ea5e9'; // Cyan/Blue
        const SECONDARY_COLOR = '#64748b'; // Slate Gray
        const TEXT_COLOR = '#0f172a'; // Dark Slate
        const ACCENT_COLOR = '#fca5a5'; // Light Red for pending/issues

        // --- HEADER ---
        // Logo Placeholder (Circle)
        doc.circle(80, 70, 25).fill(PRIMARY_COLOR);
        doc.fontSize(24).fillColor('white').text('F', 72, 58);

        // Title
        doc.fontSize(20).font('Helvetica-Bold').fillColor(TEXT_COLOR).text('FACULTY PERFORMANCE REPORT', 120, 50);
        doc.fontSize(10).font('Helvetica').fillColor(SECONDARY_COLOR).text('CONFIDENTIAL INTERNAL DOCUMENT', 120, 75);
        doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 400, 75, { align: 'right' });

        doc.moveDown(4);

        // --- PROFILE SECTION ---
        doc.rect(50, 110, 500, 70).fillOpacity(0.1).fill(PRIMARY_COLOR);
        doc.fillOpacity(1).strokeColor(PRIMARY_COLOR).stroke();

        doc.fontSize(14).font('Helvetica-Bold').fillColor(TEXT_COLOR).text(user.name, 70, 125);
        doc.fontSize(10).font('Helvetica').fillColor(SECONDARY_COLOR).text(user.email, 70, 145);

        doc.fontSize(12).font('Helvetica-Bold').text('ROLE', 350, 125);
        doc.fontSize(12).font('Helvetica').text(user.role.toUpperCase(), 350, 145);

        doc.fontSize(12).font('Helvetica-Bold').text('DEPT', 450, 125);
        doc.fontSize(12).font('Helvetica').text(user.department || 'N/A', 450, 145);

        doc.moveDown(4);

        // --- METRICS GRID ---
        const startY = 210;
        const boxWidth = 150;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const completionRate = tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(0) : 0;
        const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

        // Box 1: Tasks
        doc.rect(50, startY, boxWidth, 80).fillOpacity(0.05).fill(TEXT_COLOR).stroke();
        doc.fillOpacity(1).fillColor(TEXT_COLOR).fontSize(10).text('TOTAL TASKS', 70, startY + 20);
        doc.fontSize(24).font('Helvetica-Bold').text(tasks.length, 70, startY + 40);

        // Box 2: Submissions (Completed)
        doc.rect(225, startY, boxWidth, 80).fillOpacity(0.05).fill(PRIMARY_COLOR).stroke();
        doc.fillOpacity(1).fillColor(PRIMARY_COLOR).fontSize(10).text('COMPLETION RATE', 245, startY + 20);
        doc.fontSize(24).font('Helvetica-Bold').text(`${completionRate}%`, 245, startY + 40);

        // Box 3: Leaves
        doc.rect(400, startY, boxWidth, 80).fillOpacity(0.05).fill(ACCENT_COLOR).stroke();
        doc.fillOpacity(1).fillColor('#b91c1c').fontSize(10).text('PENDING LEAVES', 420, startY + 20);
        doc.fontSize(24).font('Helvetica-Bold').text(pendingLeaves, 420, startY + 40);

        doc.moveDown(8);

        // --- TASKS TABLE ---
        doc.fontSize(14).fillColor(TEXT_COLOR).text('Task History', 50, 320, { underline: true });

        let y = 350;
        // Table Headers
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('TITLE', 50, y);
        doc.text('STATUS', 300, y);
        doc.text('DEADLINE', 450, y);
        doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor(SECONDARY_COLOR).stroke();

        y += 25;
        doc.font('Helvetica').fontSize(10);

        tasks.slice(0, 10).forEach(task => { // Limit to 10 for single page cleanliness
            if (y > 700) { doc.addPage(); y = 50; }
            doc.text(task.title.substring(0, 40) + (task.title.length > 40 ? '...' : ''), 50, y);

            // Status Color
            let statusColor = TEXT_COLOR;
            if (task.status === 'Completed') statusColor = 'green';
            if (task.status === 'Pending') statusColor = 'orange';

            doc.fillColor(statusColor).text(task.status, 300, y);
            doc.fillColor(TEXT_COLOR).text(task.deadline, 450, y);

            y += 20;
            doc.moveTo(50, y - 10).lineTo(550, y - 10).lineWidth(0.5).strokeOpacity(0.2).stroke();
        });

        doc.moveDown(4);

        // --- FOOTER ---
        doc.fontSize(8).fillColor(SECONDARY_COLOR).text('Powered by Faculty Management System V2.0', 50, 750, { align: 'center' });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateFacultyReport };
