const { sequelize } = require('./config/db');
const User = require('./models/userModel');
const Task = require('./models/taskModel');
const Leave = require('./models/leaveModel');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Clear DB

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create Users (Admin, HOD, Lecturer)
        await User.bulkCreate([
            {
                id: uuidv4(),
                name: 'System Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                department: 'Administration'
            },
            {
                id: uuidv4(),
                name: 'Dr. Sarah Connor',
                email: 'hod@gmail.com',
                password: hashedPassword,
                role: 'hod',
                department: 'Computer Science'
            },
            {
                id: uuidv4(),
                name: 'John Doe',
                email: 'lecturer@gmail.com', // User requested lecturer kind of thing
                password: hashedPassword,
                role: 'lecturer',
                department: 'Computer Science'
            }
        ]);

        console.log('✅ SQLite Seeded with Admin, HOD, Lecturer');
        process.exit();
    } catch (error) {
        console.error('❌ Seed Failed:', error);
        process.exit(1);
    }
};

seedData();
