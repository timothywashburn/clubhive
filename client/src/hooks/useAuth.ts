import { useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const toggleAuth = () => {
        setIsAuthenticated(prev => !prev);
    };

    return { isAuthenticated, toggleAuth };
}
