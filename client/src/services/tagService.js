import { REACT_APP_API_URL, api } from "./config";

const TAG_API_URL = `${REACT_APP_API_URL}/tag`;

// Function to get tags with question count
const getTagsWithQuestionNumber = async () => {
    try {
        const response = await api.get(`${TAG_API_URL}/getTagsWithQuestionNumber`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        throw error; // Rethrow to handle in UI
    }
};

// Function to delete a tag
const deleteTag = async (tagName) => {
    try {
        const response = await api.delete(`${TAG_API_URL}/deleteTag/${tagName}`);
        return response.data; // This will be the success message from the server
    } catch (error) {
        console.error('Failed to delete tag:', error);
        throw error; // Rethrow to handle in UI
    }
};

export { getTagsWithQuestionNumber, deleteTag };
