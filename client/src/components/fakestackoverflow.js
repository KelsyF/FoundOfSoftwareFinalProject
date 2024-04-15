import React, { useState } from "react";
import Header from "./header";
import Main from "./main";
import Login from "./main/loginPage";
import Register from "./main/addUser";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [currentPage, setCurrentPage] = useState("main");

    const handleLoginSuccess = () => {
        setCurrentPage("main");  // Set the page to 'main' after login
        console.log("User logged in and redirected to home");
    };

    const handleRegisterSuccess = () => {
        setCurrentPage("main");  // Set the page to 'main' after registration
        console.log("User registered and redirected to home");
    };

    return (
        <>
            <Header 
                search={search} 
                setQuestionPage={(val, title) => {
                    setSearch(val);
                    setMainTitle(title);
                    setCurrentPage("main");
                }} 
                handleLogin={() => setCurrentPage("login")}
                handleRegister={() => setCurrentPage("register")}
            />
            {currentPage === "main" && (
                <Main
                    title={mainTitle}
                    search={search}
                    setQuestionPage={(val, title) => {
                        setSearch(val);
                        setMainTitle(title);
                        setCurrentPage("main");
                    }}
                    handleLogin={handleLoginSuccess}
                />
            )}
            {currentPage === "login" && (
                <Login handleLogin={handleLoginSuccess} />
            )}
            {currentPage === "register" && (
                <Register handleRegister={handleRegisterSuccess} />
            )}
        </>
    );
}
