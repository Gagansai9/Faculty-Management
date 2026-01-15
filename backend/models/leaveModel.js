const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');

const Leave = sequelize.define('Leave', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    },
    adminComment: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

// Relationships
User.hasMany(Leave, { foreignKey: 'userId' });
Leave.belongsTo(User, { foreignKey: 'userId' });

module.exports = Leave;
