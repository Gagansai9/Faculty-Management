const { sequelize } = require('./config/db');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

const seedProduction = async () => {
    try {
        console.log('🌱 Starting Production Seed...');
        await sequelize.authenticate();
        await sequelize.sync(); // Ensure tables exist

        const adminEmail = 'admin@gmail.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin exists
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('🔄 Admin found. Updating password and permissions...');
            existingAdmin.password = hashedPassword;
            existingAdmin.isApproved = true;
            existingAdmin.role = 'admin'; // Enforce role
            await existingAdmin.save();
        } else {
            console.log('🆕 Creating new Admin user...');
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                department: 'Administration',
                designation: 'System Administrator',
                isApproved: true
            });
        }

        console.log(`✅ Admin Seeding Complete.`);
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding Failed:', error);
        process.exit(1);
    }
};

seedProduction();
