const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@university.edu',
                password: 'password123',
                role: 'admin',
                department: 'Administration',
                designation: 'System Administrator'
            },
            {
                name: 'Dr. John Doe',
                email: 'faculty@university.edu',
                password: 'password123',
                role: 'faculty',
                department: 'Computer Science',
                designation: 'Associate Professor'
            }
        ];

        // The pre-save hook in User model will hash these passwords
        await User.create(users);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
