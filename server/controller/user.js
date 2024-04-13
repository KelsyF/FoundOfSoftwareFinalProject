const express = require("express");
const User = require("../models/user");

const router = express.Router();

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

module.exports = router;