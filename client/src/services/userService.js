import { REACT_APP_API_URL, api } from "./config";  // Ensure this path is correct

const USER_API_URL = `${REACT_APP_API_URL}/user`;

// To add user
const addUser = async (username, password) => {
    const data = {username, password};
    try {
        const res = await api.post(`${USER_API_URL}/addUser`, data);
        return { success: true, data: res.data };
    } catch (error) {
        return { success: false, message: error.response.data.message || "User registration failed" }
    }
};

// Login user
const loginUser = async (username, password, login) => {
    const data = { username, password };
    try {
        const res = await api.post(`${USER_API_URL}/login`, data);
        if (res.data.success) {
            login(username);
            return { success: true, message: res.data.message, user: res.data.user };
        } else {
            return { success: false, message: res.data.message || "Login failed" };
        }
    } catch (error) {
        return { success: false, message: "Username/Password combination not found" };
    }
};

// Fetch all posts by a user
const fetchUserPosts = async (username) => {
    try {
        const res = await api.get(`${USER_API_URL}/username/${username}/posts`);
        return { success: true, posts: res.data.posts };
    } catch (error) {
        return { success: false, message: error.response.data.message || "Failed to fetch posts" };
    }
};

// Fetch all answers by a user
const fetchUserAnswers = async (username) => {
    try {
        const res = await api.get(`${USER_API_URL}/username/${username}/answers`);
        return { success: true, answers: res.data.answers };
    } catch (error) {
        return { success: false, message: error.response.data.message || "Failed to fetch answers" };
    }
};

// userServices.js

// Function to delete user
const deleteUser = async (username) => {
    try {
        const res = await api.delete(`${USER_API_URL}/deleteUser/${username}`);
        return { success: res.data.success, message: res.data.message };
    } catch (error) {
        return { success: false, message: error.response.data.message || "Failed to delete user" };
    }
};


export { addUser, loginUser, fetchUserPosts, fetchUserAnswers, deleteUser };
