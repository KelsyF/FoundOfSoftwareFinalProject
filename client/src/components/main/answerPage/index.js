import React, { useEffect, useState } from "react";
import Answer from "./answer"; // Make sure this path is correct
import AnswerHeader from "./header"; // Adjust paths as necessary
import QuestionBody from "./questionBody";
import { getMetaData } from "../../../tool"; // Adjust paths as necessary
import { getQuestionById } from "../../../services/questionService"; // Adjust paths and imports as necessary
import { deleteAnswer } from "../../../services/answerService"; // Adjust paths and imports as necessary

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, handleUsername, handleQuestions }) => {
    const [question, setQuestion] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getQuestionById(qid);
                if (res) {
                    setQuestion(res);
                }
            } catch (error) {
                console.error("Error fetching question data:", error);
            }
        };
        fetchData();
    }, [qid]);

    const handleDeleteAnswer = async (answerId) => {
        try {
            await deleteAnswer(answerId);
            // Refresh the question to update the list of answers
            const updatedQuestion = await getQuestionById(qid);
            setQuestion(updatedQuestion);
            console.log("Answer deleted successfully");
        } catch (error) {
            console.error("Failed to delete answer:", error);
        }
    };

    // Sort answers by date time (newest to oldest)
    const sortAnswersByDateTime = (answers) => {
        return answers.slice().sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
    }

    return (
        <>
            <AnswerHeader
                ansCount={question.answers ? question.answers.length : 0}
                title={question.title || "Loading..."}
                handleNewQuestion={handleNewQuestion}
            />
            <QuestionBody
                qid={question._id}
                views={question.views}
                text={question.text}
                askby={question.asked_by}
                meta={getMetaData(new Date(question.ask_date_time))}
                handleUsername={handleUsername}
                onDeletionSuccess={handleQuestions}
            />
            {question.answers && sortAnswersByDateTime(question.answers).map((answer, idx) => (
                <Answer
                    key={idx}
                    text={answer.text}
                    ansBy={answer.ans_by}
                    meta={getMetaData(new Date(answer.ans_date_time))}
                    handleUsername={handleUsername}
                    answerId={answer._id}
                    onDelete={handleDeleteAnswer}
                />
            ))}
            <button
                className="bluebtn ansButton"
                onClick={handleNewAnswer}
            >
                Answer Question
            </button>
        </>
    );
};

export default AnswerPage;
