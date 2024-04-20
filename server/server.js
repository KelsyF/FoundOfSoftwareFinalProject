const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');

// MongoDB Connection URL and Server Port configuration
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final_fake_so";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const port = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useUnifiedTopology: true });

const app = express();

// CORS Configuration
app.use(cors({
    origin: [CLIENT_URL], // Only allow your client to connect
    credentials: true, // Allow credentials
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route for base URL
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Import routers
const questionRouter = require("./controller/question");
const tagRouter = require("./controller/tag");
const answerRouter = require("./controller/answer");
const userRouter = require("./controller/user");

// Use routers
app.use("/question", questionRouter);
app.use("/tag", tagRouter);
app.use("/answer", answerRouter);
app.use("/user", userRouter);

// Export the app
module.exports = app;

// Function to start the server
function startServer() {
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    // Graceful shutdown
    process.on("SIGINT", () => {
        server.close(() => {
            mongoose.disconnect();
            //process.exit(0);
        });
    });

    return server;
}

// Start the server only if the file is run directly
if (require.main === module) {
    startServer();
}

// Export the startServer function separately
module.exports.startServer = startServer;
