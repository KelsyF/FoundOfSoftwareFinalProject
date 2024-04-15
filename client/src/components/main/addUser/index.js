// RegisterPage.js
import "./index.css";
import { useState } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import { addUser } from "../../../services/userService";

const RegisterPage = ({ handleRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameErr, setUsernameErr] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

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


        const res = await addUser(username, password); // Call your API service here
        if (res.success) {  // Make sure your backend sends a 'success' property
            handleRegister(); // Update UI upon successful registration
        } else {
            alert("Registration failed: " + res.message); // Provide feedback
        }

        
        // Here you might want to call an API to register the user
        // For example:
        // const res = await registerUser(username, password);
        // if (res.success) {
        //     handleRegister();
        // }

        //handleRegister(); // Placeholder to simulate successful registration
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
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        register();
                    }}
                >
                    Register
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default RegisterPage;
