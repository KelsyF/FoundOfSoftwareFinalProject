const express = require("express");
const User = require("../models/user");


const router = express.Router();

// user.js
router.post('/addUser', async (req, res) => {
    // Adjusted to match schema
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({msg: 'Bad request: Missing required fields'});
    }

    try {
        const savedUser = await User.create({ username, password });
        res.status(200).json({ success: true, user: savedUser });
    } catch (error) {
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && user.password === password) {
        req.session.user = user; // Set user details in session
        res.json({ success: true, message: "Logged in successfully", user: user });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});



/*
router.post('/addUser', async (req, res) => {
    try {
        console.log("Starting to add a user...", req.body);

        const { un, pw } = req.body;
        if (!un || !pw) {
            console.error("Missing username or password", { un, pw });
            return res.status(400).json({msg: 'Bad request: Missing required fields'});
        }

        // Use User.create to create the user
        const savedUser = await User.create({ un, pw });

        console.log("User saved successfully", savedUser);

        // Match the expected status code and return the saved user
        res.status(200).json(savedUser);
    } catch (error) {
        console.error('Error adding a user: ', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});
*/
module.exports = router;