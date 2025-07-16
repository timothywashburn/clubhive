import { useEffect } from 'react';
import { Theme, ThemePreference, useThemeStore } from '../stores/themeStore';

export function useTheme() {
    const { preference, setTheme, setPreference } = useThemeStore();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const getTheme = () => {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                setTheme(storedTheme as Theme);
                setPreference(storedTheme as ThemePreference);
                localStorage.setItem('theme', storedTheme);
            } else {
                setTheme(mediaQuery.matches ? 'dark' : 'light');
                setPreference('system');
                localStorage.removeItem('theme');
            }
        };

        getTheme();
        mediaQuery.addEventListener('change', getTheme);
        return () => mediaQuery.removeEventListener('change', getTheme);
    }, [preference, setTheme, setPreference]);
}
