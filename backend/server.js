const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/faculty', require('./routes/facultyRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// --- DEPLOYMENT: SERVE STATIC FRONTEND ---
const path = require('path');
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Anything that doesn't match the above routes, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
// -----------------------------------------

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
