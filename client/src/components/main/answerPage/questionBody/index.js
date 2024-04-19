import "./index.css";
import React from "react";
import { handleHyperlink } from "../../../../tool";

// Component for the Question's Body
const QuestionBody = ({ views, text, askby, meta, handleUsername }) => {
    return (
        <div id="questionBody" className="questionBody right_padding">
            <div className="bold_title answer_question_view">{views} views</div>
            <div className="answer_question_text">{handleHyperlink(text)}</div>
            <div className="answer_question_right" onClick={(e) => {
                        e.stopPropagation();
                        handleUsername(askby.username);
                    }}>
                {/* Access the username property of the askby object */}
                <div className="question_author">{askby ? askby.username : 'Unknown Author'}</div>
                <div className="answer_question_meta">asked {meta}</div>
            </div>
        </div>
    );
};


export default QuestionBody;
