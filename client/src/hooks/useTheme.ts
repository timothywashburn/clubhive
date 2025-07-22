import { useEffect } from 'react';
import { ThemePreference, useThemeStore } from '../stores/themeStore';

export function useTheme() {
    const { preference, setTheme, setPreference } = useThemeStore();

    useEffect(() => {
        const getStoredTheme = () => {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) setPreference(storedTheme as ThemePreference);
        };

        getStoredTheme();
    }, [setPreference]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const getTheme = () => {
            switch (preference) {
                case 'dark':
                    setTheme('dark');
                    break;
                case 'light':
                    setTheme('light');
                    break;
                case 'system':
                default:
                    setTheme(mediaQuery.matches ? 'dark' : 'light');
                    break;
            }
        };

        getTheme();
        mediaQuery.addEventListener('change', getTheme);
        return () => mediaQuery.removeEventListener('change', getTheme);
    }, [preference, setTheme]);
}
