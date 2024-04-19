import "./index.css";
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";
import LoginPage from "./loginPage"
import Register from "./addUser"
import UserProfile from "./userProfile";  // Adjust the path as necessary


const Main = ({ search = "", title, setQuestionPage }) => {
    const [page, setPage] = useState("home");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    const [username, setUsername] = useState("");

    let selected = "";
    let content = null;

    const handleQuestions = () => {
        setPage("home");
        setQuestionPage(); 
    };
    
    const handleUsername = (username) => {
        setUsername(username);
        setPage("userprofile");
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

    const handleLogin = () => {
        setPage("home");
    };

    const handleRegister = () => {
        setPage("home");
    }

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
                handleUsername = {handleUsername}
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
                    handleUsername = {handleUsername}
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
            content = <LoginPage qid={qid} handleLogin={handleLogin} />;
            break;
        }
        case "register": {
            selected = "";
            content = <Register handleRegister={handleRegister} />;
            break;
        }


        case "userprofile": {
            selected = "";
            content = <UserProfile username={username} handleAnswer={handleAnswer} />;
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
