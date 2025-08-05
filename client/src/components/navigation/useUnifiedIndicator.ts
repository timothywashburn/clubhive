import { useState, useEffect, useRef, useCallback } from 'react';

interface UnifiedIndicatorOptions {
    activeKey: string;
    availableKeys: string[];
    navType: 'site' | 'tabs';
    // For tabs - context switching detection
    contextId?: string;
    isPreviewMode?: boolean;
}

export const useUnifiedIndicator = ({ activeKey, availableKeys, navType, contextId, isPreviewMode = false }: UnifiedIndicatorOptions) => {
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const [shouldAnimatePosition, setShouldAnimatePosition] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    // For site nav - track visibility state
    const wasVisibleRef = useRef(false);

    // For tabs - track context changes
    const prevContextRef = useRef<string | null>(null);

    const updateIndicator = useCallback(() => {
        const activeElement = elementRefs.current[activeKey];
        if (activeElement) {
            const containerSelector = navType === 'site' ? '.nav-container' : 'nav';
            const container = activeElement.closest(containerSelector);
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const elementRect = activeElement.getBoundingClientRect();

                setIndicatorStyle({
                    left: elementRect.left - containerRect.left,
                    width: elementRect.width,
                });

                // Handle visibility for site nav
                if (navType === 'site') {
                    if (!wasVisibleRef.current) {
                        // For fade-in: disable position animation, set position immediately, then fade in
                        setShouldAnimatePosition(false);
                        setIsVisible(false);
                        // Use requestAnimationFrame to ensure position is set before opacity change
                        requestAnimationFrame(() => {
                            setIsVisible(true);
                            // Re-enable position animation after fade-in starts
                            setTimeout(() => setShouldAnimatePosition(true), 100);
                            // Only mark as visible AFTER the fade-in starts
                            wasVisibleRef.current = true;
                        });
                    } else {
                        setIsVisible(true);
                        setShouldAnimatePosition(true);
                    }
                } else {
                    setIsVisible(true);
                    setShouldAnimatePosition(true);
                }
            } else if (navType === 'site') {
                setIsVisible(false);
                wasVisibleRef.current = false;
            }
        } else if (navType === 'site') {
            setIsVisible(false);
            wasVisibleRef.current = false;
        }
    }, [activeKey, navType]);

    // Handle context changes for tabs
    useEffect(() => {
        if (navType === 'tabs' && contextId) {
            const currentContext = `${contextId}-${isPreviewMode}-${activeKey.startsWith('event-') ? 'event' : 'main'}`;
            const contextChanged = prevContextRef.current && prevContextRef.current !== currentContext;
            prevContextRef.current = currentContext;

            if (contextChanged) {
                // Delay indicator update when context changes
                const timer = setTimeout(() => {
                    updateIndicator();
                }, 225);
                return () => clearTimeout(timer);
            } else {
                updateIndicator();
            }
        } else {
            updateIndicator();
        }
    }, [activeKey, contextId, isPreviewMode, updateIndicator, navType]);

    // Handle active key changes for site nav
    useEffect(() => {
        if (navType === 'site') {
            const hasActiveItem = availableKeys.includes(activeKey);
            if (hasActiveItem) {
                updateIndicator();
            } else {
                setIsVisible(false);
                wasVisibleRef.current = false;
            }
        }
    }, [activeKey, availableKeys, navType, updateIndicator]);

    // Initialize animation delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldAnimate(true);
            setShouldAnimatePosition(true);
        }, 100);
        return () => clearTimeout(timer);
    }, [contextId]); // Re-trigger on context changes

    return {
        indicatorStyle,
        shouldAnimate,
        shouldAnimatePosition,
        setShouldAnimate,
        elementRefs,
        isVisible: navType === 'tabs' ? true : isVisible,
    };
};
