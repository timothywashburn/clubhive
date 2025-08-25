import { create } from 'zustand';

interface HoneycombStore {
    x: number;
    y: number;
    scale: number;
    isLandingPage: boolean;
    setPosition: (x: number, y: number, scale: number) => void;
    setScrollY: (scrollY: number) => void;
    setIsLandingPage: (isLanding: boolean) => void;
}

export const useHoneycombStore = create<HoneycombStore>((set, get) => ({
    x: 0,
    y: 0,
    scale: 1.3,
    isLandingPage: false,
    setPosition: (x: number, y: number, scale: number) => {
        const { isLandingPage } = get();
        set({
            x,
            y,
            scale: isLandingPage ? scale : 1.3,
        });
    },
    setScrollY: (scrollY: number) => {
        set({ y: scrollY * -0.05 + 100 });
    },
    setIsLandingPage: (isLanding: boolean) => {
        set({
            isLandingPage: isLanding,
            scale: isLanding ? get().scale : 1.3,
        });
    },
}));
