/*
const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    res.json(['Complete the function']);
};

// add appropriate HTTP verbs and their endpoints to the router.

module.exports = router;
*/

const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

// Get tags with question numbers
router.get('/getTagsWithQuestionNumber', async (req, res) => {
    try {
        const tags = await Tag.find({});
        const questions = await Question.find({}).populate('tags'); // Assuming population is needed to match test setup

        const tagsWithQCount = tags.map((tag) => {
            // Simulate counting by filtering questions where tag is present
            const qCount = questions.filter(q => q.tags.some(t => t.name === tag.name)).length;
            return { name: tag.name, qcnt: qCount };
        });
        
        res.json(tagsWithQCount);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tags", error: error.message });
    }
});

// Delete tag endpoint
router.delete('/deleteTag/:tagName', async (req, res) => {
    const tagName = req.params.tagName;

    console.log("Attempting to delete tag:", tagName);

    try {
        // Find the tag by name to get its ObjectId
        const tag = await Tag.findOne({ name: tagName });
        if (!tag) {
            console.log("Tag not found in database:", tagName);
            return res.status(404).send('Tag not found');
        }

        // Debug: Show the tag object found
        console.log("Tag found:", tag);

        // Remove the tag from all questions
        const updateResult = await Question.updateMany(
            {},
            { $pull: { tags: tag._id } } // Use the ObjectId of the tag
        );

        // Debug: Output the result of the update operation
        console.log("Questions update result:", updateResult);

        // Delete the tag itself
        const deletionResult = await Tag.deleteOne({ _id: tag._id });

        // Debug: Output the result of the deletion operation
        console.log("Tag deletion result:", deletionResult);

        if (deletionResult.deletedCount === 0) {
            console.log("Failed to delete the tag from Tag collection:", tagName);
            return res.status(404).send('Tag not found in Tag collection');
        }

        console.log("Tag deleted successfully:", tagName);
        res.send('Tag deleted successfully');
    } catch (error) {
        console.error("Error in deleting tag:", error);
        res.status(500).json({ message: "Failed to delete tag", error: error.message });
    }
});




module.exports = router;

