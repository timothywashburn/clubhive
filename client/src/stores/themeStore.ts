import { create } from 'zustand';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeStore {
    theme: Theme;
    preference: ThemePreference;
    setTheme: (theme: Theme) => void;
    setPreference: (theme: ThemePreference) => void;
}

export const useThemeStore = create<ThemeStore>(set => ({
    theme: null,
    preference: null,

    setTheme: theme => {
        const root = window.document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        set({ theme });
    },

    setPreference: preference => {
        localStorage.setItem('theme', preference);
        set({ preference });
    },
}));
