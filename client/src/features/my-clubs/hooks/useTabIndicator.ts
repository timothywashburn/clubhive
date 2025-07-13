import { useState, useEffect, useRef } from 'react';
import { TabType } from '../types';

export const useTabIndicator = (
    activeTab: TabType,
    selectedClub: any,
    isPreviewMode: boolean
) => {
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    useEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        if (activeTabElement) {
            const navElement = activeTabElement.closest('nav');
            if (navElement) {
                const navRect = navElement.getBoundingClientRect();
                const tabRect = activeTabElement.getBoundingClientRect();
                setIndicatorStyle({
                    left: tabRect.left - navRect.left,
                    width: tabRect.width,
                });
            }
        }
    }, [activeTab, selectedClub, isPreviewMode]);

    useEffect(() => {
        if (selectedClub) {
            const timer = setTimeout(() => setShouldAnimate(true), 100);
            return () => clearTimeout(timer);
        }
    }, [selectedClub]);

    return {
        indicatorStyle,
        shouldAnimate,
        setShouldAnimate,
        tabRefs,
    };
};
