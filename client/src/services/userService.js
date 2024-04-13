import { REACT_APP_API_URL } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

//To add user
const addUser = async (username, password) => {
    const data = { username: username, password: password };
    const res = await api.post(`${USER_API_URL}/addUser`, data);

    return res.data;
}

export { addUser };