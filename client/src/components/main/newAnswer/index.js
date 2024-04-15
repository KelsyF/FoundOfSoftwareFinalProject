import "./index.css";
import { useState } from "react";
import Form from "../baseComponents/form";
//import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { addAnswer } from "../../../services/answerService";

// Assuming `userContext` provides the current user's ID and not just their username
import { useUser } from '../../context/UserContext'; // Correct the import path as necessary

const NewAnswer = ({ qid, handleAnswer }) => {
    const { user } = useUser(); // Assuming this includes user.username
    const [text, setText] = useState("");
    const [textErr, setTextErr] = useState("");

    const postAnswer = async () => {
        let isValid = true;
    
        if (!text) {
            setTextErr("Answer text cannot be empty");
            isValid = false;
        }
    
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }
    
        if (!isValid) {
            return;
        }
    
        // Correct the structure here
        const answerDetails = {
            text: text,
            ans_by: user.username, // Assuming user.username is the username of the logged-in user
            ans_date_time: new Date(),
        };
    
        // Send answerDetails directly within an 'ans' object
        const res = await addAnswer(qid, { ans: answerDetails });  // This should align with backend expectations
        if (res && res._id) {
            handleAnswer(qid);
        }
    };
    
    

    return (
        <Form>
            <Textarea
                title={"Answer Text"}
                id={"answerTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            <div className="btn_indicator_container">
                <button className="form_postBtn" onClick={postAnswer}>
                    Post Answer
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default NewAnswer;


