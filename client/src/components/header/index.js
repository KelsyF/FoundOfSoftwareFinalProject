import React, { useState } from "react";
import "./index.css";
import { useUser } from "../context/UserContext"; // Correct the import path as necessary

const Header = ({
    search,
    setQuestionPage,
}) => {
    const [val, setVal] = useState(search);
    const { user, logout } = useUser(); // Use the context for user management

    const handleLogout = () => {
        logout();
        setQuestionPage("", "All Questions", "main");
    }

    return (
        <div id="header" className="header">
            <div className="title">Fake Stack Overflow</div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setQuestionPage(val, "Search Results", "main"); // Use the search term to update the question page
                    }
                }}
            />
            {user ? (
                <>
                    <span onClick={() => {
                        setQuestionPage("", "", "userprofile");
                    }}
                    >Welcome, {user.username}!</span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => {
                        setQuestionPage("", "Login", "login");
                    }}
                    >Login</button>
                    <button onClick={() => {
                        setQuestionPage("", "Register", "register");
                    }}
                    >Register</button>
                </>
            )}
        </div>
    );
};
export default Header;
