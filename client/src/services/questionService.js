import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );

    console.log("Received question data:", res.data);

    return res.data;
};

// To get Questions by ID
const getQuestionById = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);

    console.log("Received question ID data:", res.data);

    return res.data;
};

// To add Questions
const addQuestion = async (q) => {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);

    return res.data;
};

// To delete a Question
const deleteQuestion = async (qid) => {
    try {
        const res = await api.delete(`${QUESTION_API_URL}/deleteQuestion/${qid}`);
        console.log("Question deleted successfully:", res.data);
        return res.data;
    } catch (error) {
        console.error("Failed to delete question:", error);
        throw error; // Rethrowing the error is important for handling it in the React component
    }
};

export { getQuestionsByFilter, getQuestionById, addQuestion, deleteQuestion };
