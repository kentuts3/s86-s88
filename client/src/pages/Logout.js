import { useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
    const { setUser, unsetUser } = useContext(UserContext);

    useEffect(() => {
        // Call unsetUser to remove the user session data (if you have this function handling cleanup)
        if (unsetUser) {
            unsetUser();
        }

        // Reset user context to null/empty state
        setUser({
            id: null,
            isAdmin: null
        });

        // Clear any local storage or session data if necessary (like token)
        localStorage.removeItem('token');

        // Clean up logic if any
    }, [setUser, unsetUser]);

    // Redirect to login page after logout
    return <Navigate to='/login' />;
}