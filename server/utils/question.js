const Tag = require("../models/tags");
const Question = require("../models/questions");
const User = require('../models/user'); // Adjust the path according to the actual location


const addTag = async (tname) => {
    let tag = await Tag.findOne({ name: tname });
    if (!tag) {
        // Instead of directly saving the new tag,
        // create the tag instance and then explicitly return the saved instance's ID
        const newTag = new Tag({ name: tname });
        const savedTag = await newTag.save();
        
        // Return the ID of the saved tag wrapped in an array
        return [savedTag._id];
    }
    // For an existing tag, just return the tag's ID wrapped in an array
    return [tag._id];
};




const getQuestionsByOrder = async (order) => {
    try {
        if (order === 'newest') {
            //return await Question.find().sort({ ask_date_time: -1 }).populate('tags', 'name');
            let questions = await Question.find().populate('tags', 'name').populate('asked_by','username');
            // Explicitly sort the filtered questions by ask_date_time in descending order.
            return questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
        } else if (order === 'active') {
            let questions = await Question.find().populate('tags', 'name').populate('answers');

            questions.sort((a, b) => {
                // Check for the presence of answers and determine the last answer date
                let aLastAnswerDate = a.answers.length > 0 ? new Date(Math.max(...a.answers.map(answer => new Date(answer.ans_date_time)))) : null;
                let bLastAnswerDate = b.answers.length > 0 ? new Date(Math.max(...b.answers.map(answer => new Date(answer.ans_date_time)))) : null;

                // Prioritize questions with answers over those without
                if (aLastAnswerDate && !bLastAnswerDate) return -1;
                if (!aLastAnswerDate && bLastAnswerDate) return 1;

                // If both questions have answers, sort by the latest answer date
                if (aLastAnswerDate && bLastAnswerDate) {
                    const dateComparison = bLastAnswerDate - aLastAnswerDate;
                    if (dateComparison !== 0) return dateComparison;
                }

                // If both questions have answers with the same date or both are unanswered, sort by ask_date_time
                return b.ask_date_time.getTime() - a.ask_date_time.getTime();
            });

            return questions;
        } else if (order === 'unanswered') {
            let questions = await Question.find().populate('tags', 'name');
            // Filter out questions with answers.
            questions = questions.filter(q => q.answers.length === 0);
            // Explicitly sort the filtered questions by ask_date_time in descending order.
            return questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
            
        } else {
            return await Question.find().sort({ ask_date_time: -1 }).populate('tags', 'name');
        }
    } catch (error) {
        console.error("Error fetching questions by order:", error);
        throw new Error("Failed to fetch questions by order");
    }
};


const filterQuestionsBySearch = (qlist, search) => {
    if (!search.trim()) return qlist; // Immediately return all questions if search is empty

    const tagRegex = /\[([^\]]+)]/g;
    let tagNames = [], nonTagKeywords = [];
    let tagMatch;

    while ((tagMatch = tagRegex.exec(search)) !== null) {
        tagNames.push(tagMatch[1].toLowerCase());
    }

    const nonTagSearch = search.replace(tagRegex, '').trim().toLowerCase();
    if (nonTagSearch) {
        nonTagKeywords = nonTagSearch.split(/\s+/);
    }

    return qlist.filter(question => {
        const tagMatch = tagNames.length > 0 && question.tags.some(tag => 
            tagNames.includes(tag.name.toLowerCase()));
        const keywordMatch = nonTagKeywords.length === 0 || nonTagKeywords.some(keyword => 
            question.title.toLowerCase().includes(keyword) || 
            question.text.toLowerCase().includes(keyword));
        
        return nonTagKeywords.length > 0 ? (tagMatch || keywordMatch) : tagMatch;
    });
};


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };