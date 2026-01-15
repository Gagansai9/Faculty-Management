const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');

            // Sequelize: findByPk
            req.user = await User.findByPk(decoded.id);

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            // Remove password not needed as we won't send req.user back usually, 
            // but for safety we can just rely on the fact that we have the object.
            // Sequelize instances have .password property. 
            // We can treat it as valid user.

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
