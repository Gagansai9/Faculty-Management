const { sequelize } = require('./config/db');
const User = require('./models/userModel');
require('dotenv').config();

const check = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'admin@gmail.com' } });
        if (user) {
            console.log(`✅ FOUND: ${user.email} | Hash: ${user.password.substring(0, 10)}... | Approved: ${user.isApproved}`);
        } else {
            console.log("❌ NOT FOUND: admin@gmail.com");
        }
        process.exit();
    } catch (e) { console.error(e); }
};
check();
