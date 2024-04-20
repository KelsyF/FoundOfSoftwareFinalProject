const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// MongoDB Connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/final_fake_so";
// Frontend Client URL
const CLIENT_URL = "http://localhost:3000";
// Server Port
const port = 8000;

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit if unable to connect to the database
    });

const app = express();

// CORS Configuration
// Server.js
app.use(cors({
    origin: [CLIENT_URL], // Only allow your client to connect
    credentials: true, // Allow credentials
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

const session = require('express-session');
const cookieParser = require('cookie-parser');

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
// Assume you have an answer controller similar to the tag controller
const answerRouter = require("./controller/answer");
const userRouter = require("./controller/user");

// Use routers
app.use("/question", questionRouter);
app.use("/tag", tagRouter);
app.use("/answer", answerRouter);
app.use("/user", userRouter);

// Start the server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed");
        mongoose.disconnect().then(() => console.log("Database connection closed"));
        process.exit(0);
    });
});

module.exports = server;
