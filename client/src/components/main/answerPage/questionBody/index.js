import "./index.css";
import React from "react";
import { handleHyperlink } from "../../../../tool";
import { useUser } from "../../../context/UserContext"
// Import the deleteQuestion function at the top of your QuestionBody file
import { deleteQuestion } from "../../../../services/questionService";

const QuestionBody = ({ qid, views, text, askby, meta, handleUsername, onDeletionSuccess }) => {
    console.log("QuestionBody ID:", qid);


    const { user } = useUser();  // Get the current user from the context

    const handleDelete = async () => {
        try {
            const response = await deleteQuestion(qid);
            console.log(response);  // Log response
            onDeletionSuccess();   // Call on successful deletion
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div id="questionBody" className="questionBody right_padding">
            <div className="bold_title answer_question_view">{views} views</div>
            <div className="answer_question_text">{handleHyperlink(text)}</div>
            <div className="answer_question_right" onClick={(e) => {
                        e.stopPropagation();
                        handleUsername(askby.username);
                    }}>
                <div className="question_author">{askby ? askby.username : 'Unknown Author'}</div>
                <div className="answer_question_meta">asked {meta}</div>
            </div>
            {user && user.username === "moderator" && (
                <div className="moderatorActionContainer">
                    <button
                        className="moderator_action_button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();  // Call the delete function on click
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};



export default QuestionBody;
