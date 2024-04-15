const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require('../models/user');

const router = express.Router();

router.post('/addAnswer', async (req, res) => {
    console.log("Received answer data:", req.body);

    const { qid } = req.body;
    const ans = req.body.ans.ans; // Correctly accessing the nested 'ans' object
    if (!ans || !qid) {
        console.error("Missing answer details, username or question ID", { ans, qid });
        return res.status(400).json({ msg: 'Bad request: Missing required fields' });
    }

    try {
        console.log("Looking up user by username:", ans.ans_by);
        const user = await User.findOne({ username: ans.ans_by });
        if (!user) {
            console.log("User not found for username:", ans.ans_by);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found, user ID:", user._id);
        const answerToCreate = {
            text: ans.text,
            ans_by: user._id,
            ans_date_time: new Date(ans.ans_date_time)  // Use the provided ans_date_time
        };

        console.log("Creating answer with:", answerToCreate);
        const savedAnswer = await Answer.create(answerToCreate);
        console.log("Answer saved successfully:", savedAnswer);

        console.log("Updating question ID", qid, "with new answer ID", savedAnswer._id);
        await Question.findByIdAndUpdate(
            qid,
            { $push: { answers: savedAnswer._id } },
            { new: true }
        );

        console.log("Question updated successfully with new answer");
        res.status(200).json(savedAnswer);
    } catch (error) {
        console.error('Error adding an answer:', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});

module.exports = router;
