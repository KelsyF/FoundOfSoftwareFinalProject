import { handleHyperlink } from "../../../../tool";
import "./index.css";
import { useUser } from "../../../context/UserContext"

// Component for the Answer Page
// Assuming you have an 'id' for each answer, pass this id to the Answer component.
const Answer = ({ text, ansBy, meta, handleUsername, answerId, onDelete }) => {
    const { user } = useUser();  // Get the current user from the context

    const handleDelete = async () => {
        try {
            await onDelete(answerId);
            console.log("Answer deleted successfully");
        } catch (error) {
            console.error("Error deleting the answer:", error);
        }
    };

    return (
        <div className="answer right_padding">
            <div id="answerText" className="answerText">
                {handleHyperlink(text)}
            </div>
            <div className="answerAuthor" onClick={(e) => {
                        e.stopPropagation();
                        handleUsername(ansBy.username);
                    }}>
                <div className="answer_author">{ansBy.username}</div>
                <div className="answer_question_meta">{meta}</div>
            </div>
            {user && user.username === "moderator" && (
                <div className="moderatorActionContainer">
                    <button
                        className="moderator_action_button"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from bubbling up
                            handleDelete(); // Call the delete function on click
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};


export default Answer;
