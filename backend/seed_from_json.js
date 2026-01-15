const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/userModel');
const Task = require('./models/taskModel');
const Leave = require('./models/leaveModel');
const connectDB = require('./config/db');

dotenv.config();

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const LEAVES_FILE = path.join(DATA_DIR, 'leaves.json');

const importData = async () => {
    try {
        await connectDB();

        // READ JSON
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
        const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
        const leaves = JSON.parse(fs.readFileSync(LEAVES_FILE, 'utf-8'));

        // CLEAR DB
        await User.deleteMany();
        await Task.deleteMany();
        await Leave.deleteMany();

        // IMPORT with isApproved: true
        const usersWithApproval = users.map(user => ({
            ...user,
            isApproved: true
        }));
        await User.insertMany(usersWithApproval);
        await Task.insertMany(tasks);
        await Leave.insertMany(leaves);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
