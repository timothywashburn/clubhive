import { useState, useEffect, useRef } from 'react';

export const useNavIndicator = (activePath: string, navItems: string[]) => {
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const wasVisibleRef = useRef(false);

    useEffect(() => {
        const hasActiveNavItem = navItems.includes(activePath);

        if (hasActiveNavItem) {
            const activeNavElement = navRefs.current[activePath];
            if (activeNavElement) {
                const navContainer = activeNavElement.closest('.nav-container');
                if (navContainer) {
                    const containerRect = navContainer.getBoundingClientRect();
                    const elementRect = activeNavElement.getBoundingClientRect();

                    // Always update position immediately
                    setIndicatorStyle({
                        left: elementRect.left - containerRect.left,
                        width: elementRect.width,
                    });

                    // If transitioning from invisible to visible, delay only the opacity
                    if (!wasVisibleRef.current) {
                        setIsVisible(false); // Ensure it starts invisible
                        setTimeout(() => setIsVisible(true), 100);
                    } else {
                        setIsVisible(true);
                    }
                    wasVisibleRef.current = true;
                } else {
                    setIsVisible(false);
                    wasVisibleRef.current = false;
                }
            } else {
                setIsVisible(false);
                wasVisibleRef.current = false;
            }
        } else {
            setIsVisible(false);
            wasVisibleRef.current = false;
        }
    }, [activePath, navItems]);

    useEffect(() => {
        const timer = setTimeout(() => setShouldAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return {
        indicatorStyle,
        shouldAnimate,
        setShouldAnimate,
        navRefs,
        isVisible,
    };
};
