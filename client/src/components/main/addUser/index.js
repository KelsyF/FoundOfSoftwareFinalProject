// RegisterPage.js
import "./index.css";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { addUser } from "../../../services/userService";

const RegisterPage = ({ handleRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [registerErr, setRegisterErr] = useState("");

    const register = async () => {
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

        const { success, message } = await addUser(username, password);
        if (!success) {
            setRegisterErr(message || "Registration failed"); // Update error field so user knows of failure
            return;
        }
        handleRegister(); // Update UI upon successful registration
    };

    return (
        <Form>
            <Input
                title={"Username"}
                id={"registerUsernameInput"}
                val={username}
                setState={setUsername}
                err={usernameErr}
            />
            <Input
                type={"password"}
                title={"Password"}
                id={"registerPasswordInput"}
                val={password}
                setState={setPassword}
                err={passwordErr}
            />
            <div className="register_error">{registerErr}</div>
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={register}
                >
                    Sign-up
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

RegisterPage.propTypes = {
    handleRegister: PropTypes.func.isRequired,
}

export default RegisterPage;
