const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/questions");
const User = require('../models/user'); // Adjust the path according to your project structure


const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

const router = express.Router();

// To get Questions by Filter
router.get('/getQuestion', async (req, res) => {
   // console.log("Endpoint Hit: getQuestion with Query Params:", req.query);  // Show all query parameters
    
    try {
        const { order = 'newest', search = '' } = req.query;
       // console.log("Fetching questions with order:", order, "and search term:", search);  // Log the received query parameters
        
        let questions;

        // Fetch initial list of questions according to order
        questions = await getQuestionsByOrder(order.toLowerCase());

        // If there's a search term, filter the fetched questions further
        if (search) {
            questions = await filterQuestionsBySearch(questions, search);
            //console.log("Questions filtered by search term:", search);  // Confirm search filtering operation
        }

        // Loop through each question to log or process them before sending the response
        questions.forEach(question => {
           // console.log("Question ID:",  question._id, "Title:", question.title, "Author:", question.asked_by, "Tags:", question.tags.map(tag => tag.name));
            // Additional processing can be done here if necessary
        });
        

        //console.log("Questions fetched and ready to send:", questions.length, "questions found.");  // Log the number of questions to be sent

        //console.log("Questions fetched and ready to send:", questions);
        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);  // Using console.error for better visibility of errors
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
});



// To get Questions by id
router.get('/getQuestionById/:id', async (req, res) => {
    const { id } = req.params;

    try {
       // console.log("1");
       if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ID format:", id);
        return res.status(400).json({ message: "Invalid question ID format" });
    }
    
        //console.log("2");
        const question = await Question.findOneAndUpdate(
            { _id: id },
            { $inc: { views: 1 } },
            { new: true }
        ).populate({
            path: 'answers', // Populating answers
            populate: { 
                path: 'ans_by', // Nested populate for the user who answered
                select: 'username' // Only fetch the username field
            }
        }).populate('asked_by','username');
        //console.log("3");

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        //console.log("Questions fetched and ready to send:", question);

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question", error: error.toString() });
    }
});


router.post('/addQuestion', async (req, res) => {
    const { title, text, tags = [], asked_by: username } = req.body;
    console.log("Received request to add question:", req.body);  // Log the entire request body to see what is being sent to the server

    try {
        console.log("Looking up user by username:", username);  // Confirm username being used for user lookup
        const user = await User.findOne({ username: username });
        if (!user) {
            console.log("User not found for username:", username);  // Log if user lookup fails
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User found:", user._id);  // Log the user's ID found
        console.log("Processing tags:", tags);  // Log tags input for debugging
        const tagsWithIds = await Promise.all(tags.map(tag => addTag(tag)));

        console.log("Tags processed and IDs received:", tagsWithIds);  // Log the results of tag processing
        const newQuestion = {
            title,
            text,
            tags: tagsWithIds,
            asked_by: user._id,
            ask_date_time: new Date(),
            answers: []
        };

        console.log("Attempting to create question:", newQuestion);  // Log the question object before attempting to save
        const savedQuestion = await Question.create(newQuestion);
        console.log("Question created successfully:", savedQuestion);  // Log the saved question object

        res.status(200).json(savedQuestion);
    } catch (error) {
        console.error("Error in addQuestion endpoint:", error);  // Log any errors that occur
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
});

// questionController.js or wherever your routes are defined

// Endpoint to delete a question by ID
router.delete('/deleteQuestion/:id', async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid ID format:", id);  // Log if the ID format is invalid
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const result = await Question.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            console.log("No question found with ID:", id);  // Log if no question is found
            return res.status(404).json({ message: "No question found with that ID" });
        }

        console.log("Question deleted successfully");  // Log the successful deletion
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error during deletion:", error);  // Log the error if deletion fails
        res.status(500).json({ message: "Error deleting question", error: error.message });
    }
});






module.exports = router;
