import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import "./index.css";
import { validateHyperlink } from "../../../tool";
import { addQuestion } from "../../../services/questionService";
import { useUser } from '../../context/UserContext'; // Ensure the path is correct

const NewQuestion = ({ handleQuestions }) => {
    const { user } = useUser();  // Use the user context
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tag, setTag] = useState("");

    const [titleErr, setTitleErr] = useState("");
    const [textErr, setTextErr] = useState("");
    const [tagErr, setTagErr] = useState("");

    const postQuestion = async () => {
        if (!user) {
            alert("Please log in to post a question.");
            return;
        }
    
        let isValid = true;
        if (!title) {
            setTitleErr("Title cannot be empty");
            isValid = false;
        } else if (title.length > 100) {
            setTitleErr("Title cannot be more than 100 characters");
            isValid = false;
        }
    
        if (!text) {
            setTextErr("Question text cannot be empty");
            isValid = false;
        } else if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }
    
        let tags = tag.split(" ").filter(tag => tag.trim() !== "");
        if (tags.length === 0) {
            setTagErr("Should have at least 1 tag");
            isValid = false;
        } else if (tags.length > 5) {
            setTagErr("Cannot have more than 5 tags");
            isValid = false;
        }
    
        if (!isValid) {
            return;
        }
    
        const question = {
            title: title,
            text: text,
            tags: tags,
            asked_by: user.username,  // Use logged-in username
            ask_date_time: new Date(),
        };
    
        const res = await addQuestion(question);
        if (res && res._id) {
            handleQuestions();  // Redirect or refresh the page as necessary
        }
    };
    

    return (
        <Form>
            <Input
                title={"Question Title"}
                hint={"Limit title to 100 characters or less"}
                id={"formTitleInput"}
                val={title}
                setState={setTitle}
                err={titleErr}
            />
            <Textarea
                title={"Question Text"}
                hint={"Add details"}
                id={"formTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            <Input
                title={"Tags"}
                hint={"Add keywords separated by whitespace"}
                id={"formTagInput"}
                val={tag}
                setState={setTag}
                err={tagErr}
            />
            <div className="btn_indicator_container">
                <button className="form_postBtn" onClick={postQuestion}>
                    Post Question
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default NewQuestion;
