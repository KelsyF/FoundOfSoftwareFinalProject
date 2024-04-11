const express = require("express");
const Answer = require("../models/answers"); // Assuming this is the correct path
const Question = require("../models/questions"); // Assuming this is the correct path

const router = express.Router();

router.post('/addAnswer', async (req, res) => {
    try {
        console.log("Starting to add an answer...", req.body);

        const { ans, qid } = req.body;
        if (!ans || !qid) {
            console.error("Missing answer details or question ID", { ans, qid });
            return res.status(400).json({ msg: 'Bad request: Missing required fields' });
        }

        // Use only the fields provided in the request for ans, without automatically adding ans_date_time
        const answerToCreate = { ...ans };

        // Use Answer.create to create the answer with the dynamically constructed object
        const savedAnswer = await Answer.create(answerToCreate);

        console.log("Answer saved successfully", savedAnswer);

        // Update the question with the new answer's ID
        await Question.findOneAndUpdate(
            { _id: qid },
            { $push: { answers: { $each: [savedAnswer._id], $position: 0 } } },
            { new: true }
        );

        console.log("Question updated successfully with new answer");

        // Match the expected status code and return the saved answer
        res.status(200).json(savedAnswer);
    } catch (error) {
        console.error('Error adding an answer:', error);
        res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
});



module.exports = router;
