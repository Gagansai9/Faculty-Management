const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const run = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/faculty-portal');
        console.log("Connected to Mongo");

        const count = await User.countDocuments();
        console.log(`User Count: ${count}`);

        const admin = await User.findOne({ role: 'admin' });
        console.log(`Admin user: ${admin ? admin.email : 'NOT FOUND'}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
run();
