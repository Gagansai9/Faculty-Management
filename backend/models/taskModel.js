const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    deadline: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
        defaultValue: 'Pending'
    },
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    assignedToId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    assignedById: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

// Relationships
User.hasMany(Task, { foreignKey: 'assignedToId', as: 'assignedTasks' });
User.hasMany(Task, { foreignKey: 'assignedById', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedUser' });
Task.belongsTo(User, { foreignKey: 'assignedById', as: 'creatorUser' });

module.exports = Task;
