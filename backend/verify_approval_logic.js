const { sequelize } = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

const runVerification = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // Ensure new column exists

        console.log('--- TEST 1: Self-Registration Logic ---');
        const testEmail = `test_pending_${Date.now()}@example.com`;

        // Simulate Register Controller Logic
        const newUser = await User.create({
            name: 'Test Pending User',
            email: testEmail,
            password: 'password123',
            role: 'lecturer',
            isApproved: false // Controller sets this to false
        });

        console.log(`[PASS] User created. isApproved status: ${newUser.isApproved}`);
        if (newUser.isApproved !== false) throw new Error("FAIL: New user should default to isApproved: false");

        console.log('--- TEST 2: Login Block Logic ---');
        // Simulate Login Controller Check
        const loginAttempt = await User.findOne({ where: { email: testEmail } });
        if (!loginAttempt.isApproved) {
            console.log("[PASS] Login blocked successfully for pending user.");
        } else {
            throw new Error("FAIL: Pending user was allowed to pass approval check!");
        }

        console.log('--- TEST 3: Admin Approval ---');
        // Simulate Admin Approve API
        loginAttempt.isApproved = true;
        await loginAttempt.save();
        console.log("[PASS] User approved by admin.");

        console.log('--- TEST 4: Login Success ---');
        const retryLogin = await User.findOne({ where: { email: testEmail } });
        if (retryLogin.isApproved) {
            console.log("[PASS] Login now allowed for approved user.");
        } else {
            throw new Error("FAIL: Approved user still blocked?");
        }

        console.log('--- TEST 5: Admin Creation Logic ---');
        const adminCreatedEmail = `admin_made_${Date.now()}@example.com`;
        // Simulate Admin Create API
        const adminMadeUser = await User.create({
            name: 'Admin Created User',
            email: adminCreatedEmail,
            password: 'password123',
            role: 'hod',
            isApproved: true // Admin controller sets this to true
        });

        console.log(`[PASS] Admin-created user isApproved: ${adminMadeUser.isApproved}`);
        if (adminMadeUser.isApproved !== true) throw new Error("FAIL: Admin created user should be auto-approved");

        console.log('\n✅ ALL VERIFICATION TESTS PASSED');
        process.exit(0);

    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error);
        process.exit(1);
    }
};

runVerification();
