const mongoose = require('mongoose');
const User = require('./models/userModel');
require('dotenv').config();

const check = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/faculty-portal');
        const user = await User.findOne({ email: 'admin@gmail.com' });
        if (user) {
            console.log(`✅ FOUND: ${user.email} | Hash: ${user.password.substring(0, 10)}...`);
        } else {
            console.log("❌ NOT FOUND: admin@gmail.com");
        }
        process.exit();
    } catch (e) { console.error(e); }
};
check();
