const express = require("express");
const User = require("../models/user");  // Assuming this is your user model path
const Post = require("../models/questions");  // Assuming post model exists
const Answer = require("../models/answers");  // Assuming answer model exists
const Tag = require("../models/tags");  // Assuming tag model exists


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

router.get('/username/:username/posts', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const posts = await Post.find({ asked_by: user._id }).populate('tags', 'name');
        const postDetails = posts.map(post => ({
            id: post._id,  // Ensure ID is sent
            title: post.title,
            text: post.text,
            ask_date_time: post.ask_date_time,
            views: post.views,
            tags: post.tags.map(tag => tag.name)
        }));
        res.json({ success: true, posts: postDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


router.get('/username/:username/answers', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            //logger.warn(`User not found for username: ${req.params.username}`);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find all answers by this user
        const answersByUser = await Answer.find({ ans_by: user._id });
        const answerIds = answersByUser.map(answer => answer._id);

        // Find all questions that have any of these answers
        const questionsWithUserAnswers = await Post.find({
            answers: { $in: answerIds }
        }).populate({
            path: 'answers',
            match: { _id: { $in: answerIds } },
            populate: { path: 'ans_by' }
        });

        // Format the response to include both question and answer details
        const formattedAnswers = questionsWithUserAnswers.map(question => {
            return question.answers.map(answer => ({
                questionId: question._id,
                questionTitle: question.title,
                answerId: answer._id,
                text: answer.text,
                ans_date_time: answer.ans_date_time
            }));
        }).flat();

        res.json({ success: true, answers: formattedAnswers });
    } catch (error) {
        //logger.error('Error fetching user answers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});





module.exports = router;