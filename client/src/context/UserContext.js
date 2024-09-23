import React, { useState, createContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        isAdmin: null,
        email: null,
    });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null, isAdmin: null, email: null });
    };

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;