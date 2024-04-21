const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require('../models/user');

const router = express.Router();

router.post('/addAnswer', async (req, res) => {
    const { qid } = req.body;
    const ans = req.body.ans ? req.body.ans.ans : null;  // Safely accessing the nested 'ans' object

    if (!ans || !qid) {
        console.error("Missing answer details, question ID", { ans, qid });
        return res.status(400).json({ msg: 'Bad request: Missing required fields' });
    }

    try {
        //console.log("Looking up user by username:", ans.ans_by);
        const user = await User.findOne({ username: ans.ans_by });
        if (!user) {
            //console.log("User not found for username:", ans.ans_by);
            return res.status(404).json({ message: "User not found" });
        }

        //console.log("User found, user ID:", user._id);
        const answerToCreate = {
            text: ans.text,
            ans_by: user._id,
            ans_date_time: new Date(ans.ans_date_time)  // Use the provided ans_date_time
        };

        //console.log("Creating answer with:", answerToCreate);
        const savedAnswer = await Answer.create(answerToCreate);
        //console.log("Answer saved successfully:", savedAnswer);

        //console.log("Updating question ID", qid, "with new answer ID", savedAnswer._id);
        await Question.findByIdAndUpdate(
            qid,
            { $push: { answers: savedAnswer._id } },
            { new: true }
        );

        //console.log("Question updated successfully with new answer");
        res.status(200).json(savedAnswer);
    } catch (error) {
        console.error('Error adding an answer:', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});



router.delete('/deleteAnswer/:answerId', async (req, res) => {
    const { answerId } = req.params;
    //console.log("Attempting to delete answer ID:", answerId);

    try {
        // Find the question that includes this answer ID
        const question = await Question.findOne({ answers: { $in: [answerId] } });
        if (!question) {
            //console.log("No question found containing this answer ID:", answerId);
            return res.status(404).json({ message: "Question containing answer not found" });
        }
        //console.log("Found question containing the answer:", question);

        // Find and delete the answer document using deleteOne
        const deleteResult = await Answer.deleteOne({ _id: answerId });
        //console.log("Delete result for answer:", deleteResult);

        if (deleteResult.deletedCount === 0) {
            //console.log("No answer was deleted, possibly because it was not found:", answerId);
            return res.status(404).json({ message: "Answer not found" });
        }

        // Update the question to remove the answer ID from the answers array
        const updateResult = await Question.findByIdAndUpdate(
            question._id,
            { $pull: { answers: answerId } },  // Using answerId to ensure correct reference
            { new: true }  // Return the updated document
        );
        //console.log("Question update result:", updateResult);

        if (!updateResult) {
            //console.log("Failed to update the question to remove the answer:", answerId);
            return res.status(500).json({ message: "Failed to update question" });
        }

        res.status(200).json({ message: "Answer deleted successfully", details: updateResult });
    } catch (error) {
        console.error('Error during answer deletion:', error);
        res.status(500).json({ message: "Internal server error", error: error.toString() });
    }
});







module.exports = router;
