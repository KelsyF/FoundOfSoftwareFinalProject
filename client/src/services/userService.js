import { REACT_APP_API_URL, api } from "./config";  // Ensure this path is correct

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To add user
const addUser = async (username, password) => {
        const data = {username, password};
    try {
        const res = await api.post(`${USER_API_URL}/addUser`, data);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, message: error.response.data.message || "User registration failed"}
    }
};

// Login user
const loginUser = async (username, password, login) => {
    const data = { username, password };
    try {
        const res = await api.post(`${USER_API_URL}/login`, data);
        if (res.data.success) {
            login(username);
            return { success: true, message: res.data.message, user: res.data.user};
        } else {
            return { success: false, message: res.data.message || "Login failed" };
        }
    } catch (error) {
        return { success: false, message: "Username/Password combination not found" };
    }
};

export { addUser, loginUser };
