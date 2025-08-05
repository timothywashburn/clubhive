import { useState, useEffect, useRef } from 'react';

interface UnifiedIndicatorOptions {
    activeKey: string;
    availableKeys: string[];
    navType: 'site' | 'tabs';
    contextId?: string;
    isPreviewMode?: boolean;
}

export const useUnifiedIndicator = ({ activeKey, availableKeys, navType, contextId, isPreviewMode = false }: UnifiedIndicatorOptions) => {
    const [isVisible, setIsVisible] = useState(false);
    const [lastValidActiveKey, setLastValidActiveKey] = useState(activeKey);
    const [frozenPosition, setFrozenPosition] = useState<{ left: number; width: number } | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const elementRefs = useRef<{ [key: string]: HTMLElement | null }>({});

    const prevContextRef = useRef<string | null>(null);

    useEffect(() => {
        if (navType === 'site') {
            const hasActiveItem = availableKeys.includes(activeKey);

            if (hasActiveItem) {
                setLastValidActiveKey(activeKey);

                if (!isVisible) {
                    setIsTransitioning(true);
                    setFrozenPosition(null);
                    setTimeout(() => {
                        setIsVisible(true);
                        setIsTransitioning(false);
                    }, 300); // TODO: this is horrible, need to fix
                } else {
                    setIsVisible(true);
                    setFrozenPosition(null);
                }
            } else {
                const element = elementRefs.current[lastValidActiveKey];
                if (element && !frozenPosition) {
                    const container = element.closest('.nav-container');
                    if (container) {
                        const containerRect = container.getBoundingClientRect();
                        const elementRect = element.getBoundingClientRect();
                        setFrozenPosition({
                            left: elementRect.left - containerRect.left,
                            width: element.offsetWidth,
                        });
                    }
                }
                setIsVisible(false);
            }
        } else {
            setIsVisible(true);
            setLastValidActiveKey(activeKey);
        }
    }, [activeKey, availableKeys, navType]);

    // Handle context changes for tabs (delay indicator appearance during tab switching)
    useEffect(() => {
        if (navType === 'tabs' && contextId) {
            const currentContext = `${contextId}-${isPreviewMode}-${activeKey.startsWith('event-') ? 'event' : 'main'}`;
            const contextChanged = prevContextRef.current && prevContextRef.current !== currentContext;
            prevContextRef.current = currentContext;

            if (contextChanged) {
                setIsVisible(false);
                const timer = setTimeout(() => setIsVisible(true), 225);
                return () => clearTimeout(timer);
            }
        }
    }, [activeKey, contextId, isPreviewMode, navType]);

    return {
        elementRefs,
        isVisible,
        activeKey: lastValidActiveKey,
        frozenPosition,
        isTransitioning,
    };
};
