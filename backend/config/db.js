const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Connected...');
        await sequelize.sync(); // Auto-create tables
        console.log('✅ Database Synced...');
    } catch (error) {
        console.error('❌ Database Connection Error:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
