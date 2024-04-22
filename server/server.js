// serve.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require('express-session');
const cookieParser = require('cookie-parser');


//const MONGO_URL = process.env.MONGO_URL || "mongodb://mongodb:27017/final_fake_so";
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final_fake_so";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const port = process.env.PORT || 8000;

mongoose.connect(MONGO_URL, { useUnifiedTopology: true });

const app = express();

app.use(cors({
    origin: [CLIENT_URL],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const questionRouter = require("./controller/question");
const tagRouter = require("./controller/tag");
const answerRouter = require("./controller/answer");
const userRouter = require("./controller/user");

app.use("/question", questionRouter);
app.use("/tag", tagRouter);
app.use("/answer", answerRouter);
app.use("/user", userRouter);

function startServer() {
    const server = app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });

    process.on("SIGINT", () => {
        server.close(() => {
            mongoose.disconnect();
        });
    });

    return server;
}

function shouldStartServer() {
    return require.main === module || process.env.RUN_SERVER === "true";
}

if (shouldStartServer()) {
    startServer();
    console.log("Server started.");
}


module.exports = app;
module.exports.startServer = startServer;
module.exports.shouldStartServer = shouldStartServer;  // Export for testing