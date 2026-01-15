const { sequelize } = require('./config/db');
const User = require('./models/userModel');

const verify = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Connected');

        const count = await User.count();
        console.log(`Users in DB: ${count}`);

        const hod = await User.findOne({ where: { role: 'hod' } });
        console.log(`HOD: ${hod ? hod.email : 'MISSING'}`);

        const admin = await User.findOne({ where: { role: 'admin' } });
        console.log(`Admin: ${admin ? admin.email : 'MISSING'}`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
verify();
