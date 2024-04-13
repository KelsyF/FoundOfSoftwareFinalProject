import "./index.css";
import { useState } from "react";

const Header = ({
    search,
    setQuesitonPage,
    //handleNewUser,
}) => {
    const [val, setVal] = useState(search);
    return (
        <div id="header" className="header">
            <div></div>
            <div className="title">Fake Stack Overflow</div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setQuesitonPage(e.target.value, "Search Results");
                    }
                }}
            />
            <button
                className="login"
                onClick={() => {
                    //handleNewUser();
                    console.log("USER CREATION STARTING");
                }}
                >
                    Login
            </button>
        </div>
    );
};

export default Header;
