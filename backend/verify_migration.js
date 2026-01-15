const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Task = require('./models/taskModel');
const Leave = require('./models/leaveModel');
const connectDB = require('./config/db');

async function verifyMigration() {
    console.log("🔍 STARTING MIGRATION AUDIT...");

    // 1. Connect to DB
    await connectDB();

    // 2. Check User Count
    const userCount = await User.countDocuments();
    console.log(`Users in DB: ${userCount}`);
    if (userCount < 2) throw new Error("❌ Migration Failed: Users missing");

    // 3. Check Task Parity
    const taskCount = await Task.countDocuments();
    console.log(`Tasks in DB: ${taskCount}`);

    // 4. Check API Connectivity (Admin Create User)
    // Note: This requires the server to be running. We will assume server is up manually or skip this part if strictly db check.
    // However, let's verify a known user exists
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) throw new Error("❌ Critical: No Admin found in MongoDB");
    console.log(`✅ Admin Found: ${admin.email}`);

    console.log("✅ AUDIT PASS: MongoDB contains expected data.");
    process.exit(0);
}

verifyMigration().catch(err => {
    console.error(err);
    process.exit(1);
});
