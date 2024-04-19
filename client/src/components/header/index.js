import React, { useState } from "react";
import "./index.css";
import { useUser } from "../context/UserContext"; // Correct the import path as necessary

const Header = ({
    search,
    setQuestionPage,
    handleLogin,
    handleRegister  // These props handle navigation and other actions
}) => {
    const [val, setVal] = useState(search);
    const { user, logout } = useUser(); // Use the context for user management

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
                        setQuestionPage(val, "Search Results"); // Use the search term to update the question page
                    }
                }}
            />
            {user ? (
                <>
                    <span>Welcome, {user.username}!</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => {handleLogin();}}>Login</button>
                    <button onClick={() => {handleRegister();}}>Register</button>
                </>
            )}
        </div>
    );
};
export default Header;
