import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

import { getQuestionsByFilter } from "../../../services/questionService";
import { useEffect, useState } from "react";

const QuestionPage = ({
    title_text = "All Questions",
    order,
    search,
    setQuestionOrder,
    clickTag,
    handleAnswer,
    handleNewQuestion,
    handleUsername,
}) => {
    const [qlist, setQlist] = useState([]);
    
    useEffect(() => {
        fetchData(); // Call it here to load data initially
    }, [order, search]);

    const fetchData = async () => {
        let res = await getQuestionsByFilter(order, search);
        setQlist(res || []);
    };

    const refreshQuestions = () => {
        fetchData().catch((e) => console.log("Error fetching questions:", e));
    };

    return (
        <>
            <QuestionHeader
                title_text={title_text}
                qcnt={qlist.length}
                setQuestionOrder={setQuestionOrder}
                handleNewQuestion={handleNewQuestion}
            />
            <div id="question_list" className="question_list">
            {qlist.map((q, idx) => (
                    <Question
                        q={q}
                        key={idx}
                        clickTag={clickTag}
                        handleAnswer={handleAnswer}
                        handleUsername={handleUsername}
                        refreshQuestions={refreshQuestions}  // Passing the refresh function
                    />
                ))}
            </div>
            {title_text === "Search Results" && !qlist.length && (
                <div className="bold_title right_padding">
                    No Questions Found
                </div>
            )}
        </>
    );
};

export default QuestionPage;
