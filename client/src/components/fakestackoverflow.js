import React, { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [currentPage, setCurrentPage] = useState("main");

    return (
        <>
            <Header 
                search={search} 
                setQuestionPage={(val, title, page) => {
                    setSearch(val);
                    setMainTitle(title);
                    setCurrentPage(page);
                }}
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
                initialPage={"home"}
            />
            )}

            {currentPage === "login" && (
                <Main
                    title={mainTitle}
                    search={search}
                    setQuestionPage={(val, title) => {
                        setSearch(val);
                        setMainTitle(title);
                        setCurrentPage("main");
                    }}
                    initialPage={"login"}
                />
            )}

            {currentPage === "register" && (
                <Main
                    title={mainTitle}
                    search={search}
                    setQuestionPage={(val, title) => {
                        setSearch(val);
                        setMainTitle(title);
                        setCurrentPage("main");
                    }}
                    initialPage={"register"}
                />
            )}

            {currentPage === "userprofile" && (
                <Main
                    title={mainTitle}
                    search={search}
                    setQuestionPage={(val, title) => {
                        setSearch(val);
                        setMainTitle(title);
                        setCurrentPage("main");
                    }}
                    initialPage={"userprofile"}
                />
            )}
        </>
    );
}
