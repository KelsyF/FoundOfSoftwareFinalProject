const express = require("express");
const User = require("../models/user");  // Assuming this is your user model path
const Post = require("../models/questions");  // Assuming post model exists
const Answer = require("../models/answers");  // Assuming answer model exists


const router = express.Router();

// user.js
router.post('/addUser', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, msg: 'Bad request: Missing required fields' });
    }
    const user = await User.findOne({ username });
    if (user) {
        return res.status(409).json({ success: false, message: "Username already in use" });  // Use HTTP 409 for conflict
    }
    try {
        const savedUser = await User.create({ username, password });
        // Exclude password from the response for security reasons
        const userToReturn = { username: savedUser.username, _id: savedUser._id };
        res.status(200).json({ success: true, user: userToReturn });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'Internal server error', error: error.message });
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
    console.log("Fetching posts for user:", req.params.username); // Debugging user input
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            console.log("No user found with username:", req.params.username); // Debugging when no user is found
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const posts = await Post.find({ asked_by: user._id }).populate('tags', 'name');
        console.log(`Found ${posts.length} posts for user ID ${user._id}`); // Debugging number of posts found

        const postDetails = posts.map(post => ({
            id: post._id,
            title: post.title,
            text: post.text,
            ask_date_time: post.ask_date_time,
            views: post.views,
            tags: post.tags.map(tag => tag.name)
        }));

        console.log("Post details prepared for response:", postDetails); // Debugging the final prepared posts array
        res.json({ success: true, posts: postDetails });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});



router.get('/username/:username/answers', async (req, res) => {
    console.log("Fetching answers for user:", req.params.username); // Debugging user input
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            console.log("No user found with username:", req.params.username); // Debugging when no user is found
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const answersByUser = await Answer.find({ ans_by: user._id });
        console.log(`Found ${answersByUser.length} answers by user ID ${user._id}`); // Debugging number of answers found

        const answerIds = answersByUser.map(answer => answer._id);

        const questionsWithUserAnswers = await Post.find({
            answers: { $in: answerIds }
        }).populate({
            path: 'answers',
            match: { _id: { $in: answerIds } },
            populate: { path: 'ans_by' }
        });

        const formattedAnswers = questionsWithUserAnswers.map(question => {
            return question.answers.map(answer => ({
                questionId: question._id,
                questionTitle: question.title,
                answerId: answer._id,
                text: answer.text,
                ans_date_time: answer.ans_date_time
            }));
        }).flat();

        console.log("Formatted answers ready for response:", formattedAnswers); // Debugging final answers format
        res.json({ success: true, answers: formattedAnswers });
    } catch (error) {
        console.error("Error fetching answers:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});


// DELETE a user and all related data
// DELETE a user and all related data
router.delete('/deleteUser/:username', async (req, res) => {
    const { username } = req.params;

    console.log(`Attempting to delete user with username: ${username}`);

    try {
        // Fetch user by username
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log(`User not found for username: ${username}`);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log(`User found: ${user._id}. Proceeding to delete posts...`);

        // Delete all questions asked by the user
        const deleteQuestions = await Post.deleteMany({ asked_by: user._id });
        console.log(`Deleted ${deleteQuestions.deletedCount} questions`);

        // Delete all answers provided by the user
        const deleteAnswers = await Answer.deleteMany({ ans_by: user._id });
        console.log(`Deleted ${deleteAnswers.deletedCount} answers`);

        // Finally, delete the user
        await User.deleteOne({ _id: user._id });
        ////console.log(`Deleted user: ${deleteUser.deletedCount === 1 ? 'Success' : 'Failed'}`);

        res.status(200).json({ success: true, message: "User and all related data deleted successfully" });
    } catch (error) {
        console.error(`Error deleting user: ${error}`);
        res.status(500).json({ success: false, message: error.message });
    }
});





module.exports = router;