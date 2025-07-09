import { useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const toggleAuth = () => {
        setIsAuthenticated(prev => !prev);
    };

    return { isAuthenticated, toggleAuth };
}
