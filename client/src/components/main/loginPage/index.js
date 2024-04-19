import React, { useState } from 'react';
import "./index.css";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { useUser } from '../../context/UserContext'; // Correct the import path
import { loginUser } from '../../../services/userService'; // Import loginUser

const LoginPage = ({ handleLogin }) => {
    const { login } = useUser();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [loginErr, setLoginErr] = useState("");

    const processLogin = async () => {
        let isValid = true;

        if (!username) {
            setUsernameErr("Username cannot be empty");
            isValid = false;
        } else {
            setUsernameErr("");
        }

        if (!password) {
            setPasswordErr("Password cannot be empty");
            isValid = false;
        } else {
            setPasswordErr("");
        }

        if (!isValid) {
            return;
        }

        const { success, message } = await loginUser(username, password, login);
        if (!success) {
            setLoginErr(message || "Login failed"); // Update error field so user knows of failure
            return;
        }
        handleLogin();    // Navigate to home page after login
    };

    return (
        <Form>
            <Input
                title={"Username"}
                id={"loginUsernameInput"}
                val={username}
                setState={setUsername}
                err={usernameErr}
            />
            <Input
                type={"password"}
                title={"Password"}
                id={"loginPasswordInput"}
                val={password}
                setState={setPassword}
                err={passwordErr}
            />
            <div className="login_error">{"\n" + loginErr + "\n"}</div>
            <div className="btn_indicator_container">
                <button className="form_postBtn" onClick={processLogin}>
                    Login
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default LoginPage;
