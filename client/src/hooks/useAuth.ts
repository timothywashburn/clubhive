import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';

export function useAuth() {
    const { isAuthenticated } = useAuthStore();

    const [isAuth, setIsAuthenticated] = useState(isAuthenticated);

    const toggleAuth = () => {
        setIsAuthenticated(prev => !prev);
    };

    return { isAuth, toggleAuth };
}
