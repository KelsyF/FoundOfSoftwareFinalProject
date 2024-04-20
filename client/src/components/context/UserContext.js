import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const getUser = () => {
        const userString = localStorage.getItem('user');
        const userToken = JSON.parse(userString);
        return userToken?.user
    }

    const [user, setUser] = useState(getUser());

    useEffect(() => {
        const user = getUser();
        setUser(user);
    }, []);

    const login = (username) => {
        setUser({ username });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
