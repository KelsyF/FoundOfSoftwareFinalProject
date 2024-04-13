const express = require("express");
const mongoose = require("mongoose");
const Question = require("../models/questions");
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
            questions = filterQuestionsBySearch(questions, search);
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
        console.log("1");
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid question ID format" });
        }
        console.log("2");
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
        console.log("3");

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        console.log("Questions fetched and ready to send:", question);

        res.json(question);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question", error: error.toString() });
    }
});


router.post('/addQuestion', async (req, res) => {
    try {
        const { title, text, tags = [], asked_by } = req.body;

        // Assuming addTag returns a tag object similar to what your tests expect
        const tagsWithIds = await Promise.all(tags.map(async (tag) => {
            // addTag should return an object with _id and name for each tag
            return await addTag(tag);
        }));

        const newQuestion = {
            title,
            text,
            tags: tagsWithIds,
            asked_by,
            ask_date_time: new Date(),
            // Including a mock answer or an empty array as per your test/mock setup
            // If you have an actual answer to include, adjust here accordingly
            answers: []
        };

        // Simulate saving to database by calling a mock or actual database method
        // If using Mongoose, Question.create(newQuestion) would save the document and return the saved document including its _id
        const savedQuestion = await Question.create(newQuestion); // This should return a question object including _id

        // Ensure the response matches the structure expected by your test
        // If necessary, adjust the object below to include any missing fields or format
        res.status(200).json({
            _id: savedQuestion._id,
            title: savedQuestion.title,
            text: savedQuestion.text,
            tags: savedQuestion.tags, // Ensure this matches the expected structure in your test
            // Assuming your test expects the answers field to be present
            answers: savedQuestion.answers
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
});


module.exports = router;
