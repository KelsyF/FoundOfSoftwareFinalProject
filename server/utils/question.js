const Tag = require("../models/tags");
const Question = require("../models/questions");


const addTag = async (tname) => {
    let tag = await Tag.findOne({ name: tname });
    if (!tag) {
        const newTag = new Tag({ name: tname });
        const savedTag = await newTag.save();
        
        return [savedTag._id];
    }
    return [tag._id];
};




const getQuestionsByOrder = async (order) => {
    try {
        let questions = await Question.find().populate('tags', 'name').populate('asked_by','username').populate('answers');
        if (order === 'newest') {

            return questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
        } else if (order === 'active') {
            questions.sort((a, b) => {

                let aLastAnswerDate = a.answers.length > 0 ? new Date(Math.max(...a.answers.map(answer => new Date(answer.ans_date_time)))) : null;
                let bLastAnswerDate = b.answers.length > 0 ? new Date(Math.max(...b.answers.map(answer => new Date(answer.ans_date_time)))) : null;


                if (aLastAnswerDate && !bLastAnswerDate) return -1;
                if (!aLastAnswerDate && bLastAnswerDate) return 1;


                if (aLastAnswerDate && bLastAnswerDate) {
                    const dateComparison = bLastAnswerDate - aLastAnswerDate;
                    if (dateComparison !== 0) return dateComparison;
                }

                return b.ask_date_time.getTime() - a.ask_date_time.getTime();
            });

            return questions;
        } else if (order === 'unanswered') {

            questions = questions.filter(q => q.answers.length === 0);

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