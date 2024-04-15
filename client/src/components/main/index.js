import "./index.css";
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import Login from "./loginPage"

const Main = ({ search = "", title, setQuestionPage, handleLogin }) => {
    const [page, setPage] = useState("home");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    //const [uid , setUid] = useState("");

    let selected = "";
    let content = null;

    const handleQuestions = () => {
        setPage("home");
        setQuestionPage(); 
    };
    

    const handleTags = () => {
        setPage("tag");
    };

    const handleAnswer = (qid) => {
        setQid(qid);
        setPage("answer");
    };

    const clickTag = (tname) => {
        setQuestionPage("[" + tname + "]", tname);
        setPage("home");
    };

    const handleNewQuestion = () => {
        setPage("newQuestion");
    };

    //const handleLogin = () => {
    //    setPage("login");
   // };

    const handleNewAnswer = () => {
        setPage("newAnswer");
    };

    const getQuestionPage = (order = "newest", search = "") => {
        return (
            <QuestionPage
                title_text={title}
                order={order}
                search={search}
                setQuestionOrder={setQuestionOrder}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                handleNewQuestion={handleNewQuestion}
            />
        );
    };

    switch (page) {
        case "home": {
            selected = "q";
            content = getQuestionPage(questionOrder.toLowerCase(), search);
            break;
        }
        case "tag": {
            selected = "t";
            content = (
                <TagPage
                    clickTag={clickTag}
                    handleNewQuestion={handleNewQuestion}
                />
            );
            break;
        }
        case "answer": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                />
            );
            break;
        }
        case "newQuestion": {
            selected = "";
            content = <NewQuestion handleQuestions={handleQuestions} />;
            break;
        }
        case "newAnswer": {
            selected = "";
            content = <NewAnswer qid={qid} handleAnswer={handleAnswer} />;
            break;
        }
        case "login": {
            selected = "";
            //content = <Login qid={qid} />;
            content = <Login qid={qid} handleLogin={handleLogin} />;
            break;
        }
        
        default:
            selected = "q";
            content = getQuestionPage();
            break;
    }

    return (
        <div id="main" className="main">
            <SideBarNav
                selected={selected}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
            />
            <div id="right_main" className="right_main">
                {content}
            </div>
        </div>
    );
};

export default Main;
