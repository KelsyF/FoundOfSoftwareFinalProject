import React from 'react';
import PropTypes from 'prop-types';
import { getMetaData } from "../../../../tool";
import "./index.css";
import { useUser } from "../../../context/UserContext"
import { deleteQuestion } from "../../../../services/questionService"; // Adjust the path to match your directory structure


const Question = ({ q, clickTag, handleAnswer, handleUsername, refreshQuestions }) => {
    const { user } = useUser();  // Get the current user from the context

    const handleDelete = async (questionId, event) => {
        event.stopPropagation(); // Prevent the click from propagating to parent elements
        try {
            await deleteQuestion(questionId);
            console.log("Question deleted successfully");
            refreshQuestions();  // Call to refresh the list of questions
        } catch (error) {
            console.error("Error deleting the question:", error);
        }
    };

    return (
        <div className="question right_padding" onClick={() => handleAnswer(q._id)}>
            <div className="postStats">
                <div>{q.answers.length || 0} answers</div>
                <div>{q.views} views</div>
            </div>
            <div className="question_mid">
                <div className="postTitle">{q.title}</div>
                <div className="question_tags">
                    {q.tags.map((tag, idx) => (
                        <button
                            key={idx}
                            className="question_tag_button"
                            onClick={(e) => {
                                e.stopPropagation();
                                clickTag(tag.name);
                            }}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
                </div>
                <div className="lastActivity" onClick={(e) => {
                    e.stopPropagation();
                    handleUsername(q.asked_by.username);
                }}>
                    <div className="question_author">{q.asked_by.username}</div>
                    <div>&nbsp;</div>
                    <div className="question_meta">
                        asked {getMetaData(new Date(q.ask_date_time))}
                    </div>
                </div>
                {user && (user.username === "moderator" || user.username === q.asked_by.username) && (
                    <div className="moderatorActionContainer">
                        <button
                            className="moderator_action_button"
                            onClick={(e) => handleDelete(q._id, e)}
                        >
                            Delete
                        </button>
                    </div>
                )}
        </div>
    );
};

Question.propTypes = {
    q: PropTypes.object.isRequired,
    clickTag: PropTypes.func.isRequired,
    handleAnswer: PropTypes.func.isRequired,
    handleUsername: PropTypes.func.isRequired,
    refreshQuestions: PropTypes.func.isRequired,
};

export default Question;

