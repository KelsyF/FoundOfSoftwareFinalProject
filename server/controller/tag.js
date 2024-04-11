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

module.exports = router;

