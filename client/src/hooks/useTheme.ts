import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme') as Theme;
            return stored || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            console.log('Theme set to dark');
        } else {
            root.removeAttribute('data-theme');
            console.log('Theme set to light');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}
