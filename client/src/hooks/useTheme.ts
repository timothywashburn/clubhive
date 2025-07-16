import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme') as Theme;
            return stored || 'system';
        }
        return 'system';
    });

    const getEffectiveTheme = (themePreference: Theme): 'light' | 'dark' => {
        if (themePreference === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        }
        return themePreference;
    };

    useEffect(() => {
        const root = window.document.documentElement;
        const effectiveTheme = getEffectiveTheme(theme);

        if (effectiveTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        localStorage.setItem('theme', theme);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const newEffectiveTheme = getEffectiveTheme('system');
                if (newEffectiveTheme === 'dark') {
                    root.setAttribute('data-theme', 'dark');
                } else {
                    root.removeAttribute('data-theme');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'system';
            return 'light';
        });
    };

    const setThemeDirectly = (newTheme: Theme) => {
        setTheme(newTheme);
    };

    return {
        theme,
        toggleTheme,
        setTheme: setThemeDirectly,
        effectiveTheme: getEffectiveTheme(theme),
    };
}
