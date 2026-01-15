try {
    console.log("Loading jsonDb...");
    const jsonDb = require('./utils/jsonDb');
    console.log("jsonDb loaded.");

    console.log("Loading db config...");
    const connectDB = require('./config/db');
    console.log("db config loaded.");

    console.log("Running connectDB...");
    connectDB().then(() => {
        console.log("connectDB success.");

        console.log("Loading authController...");
        require('./controllers/authController');
        console.log("authController loaded.");

        console.log("Loading adminController...");
        require('./controllers/adminController');
        console.log("adminController loaded.");

        console.log("Loading facultyController...");
        require('./controllers/facultyController');
        console.log("facultyController loaded.");

        console.log("Loading authMiddleware...");
        require('./middleware/authMiddleware');
        console.log("authMiddleware loaded.");

        console.log("Loading authRoutes...");
        require('./routes/authRoutes');
        console.log("authRoutes loaded.");

        console.log("Loading adminRoutes...");
        require('./routes/adminRoutes');
        console.log("adminRoutes loaded.");

        console.log("Loading facultyRoutes...");
        require('./routes/facultyRoutes');
        console.log("facultyRoutes loaded.");

        console.log("Loading taskController...");
        require('./controllers/taskController');
        console.log("taskController loaded.");

        console.log("Loading taskRoutes...");
        require('./routes/taskRoutes');
        console.log("taskRoutes loaded.");

    }).catch(err => {
        console.error("connectDB failed:", err);
    });

} catch (error) {
    console.error("CRASH:", error);
}
