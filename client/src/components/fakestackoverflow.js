import React, { useState } from "react";
import Header from "./header";
import Main from "./main";
import { useUser } from "./context/UserContext";

export default function FakeStackOverflow() {
    const { user } = useUser();
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
                user={null}
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
                    user={null}
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
                    user={null}
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
                    user={ user }
                />
            )}
        </>
    );
}
