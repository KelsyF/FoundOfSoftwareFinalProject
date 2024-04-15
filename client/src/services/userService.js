import { REACT_APP_API_URL, api } from "./config";  // Ensure this path is correct

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To add user
const addUser = async (username, password) => {
    const data = { username, password };
    const res = await api.post(`${USER_API_URL}/addUser`, data);
    return res.data;
};

// Login user
const loginUser = async (username, password) => {
    const data = { username, password };
    try {
        const res = await api.post(`${USER_API_URL}/login`, data);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, message: error.response.data.message || "Login failed" };
    }
};

export { addUser, loginUser };
