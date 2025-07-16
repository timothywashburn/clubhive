import { useEffect, useRef, useCallback } from 'react';

export interface AnimationHookResult {
    startAnimation: (animationCallback: () => void) => void;
    stopAnimation: () => void;
    isAnimating: React.MutableRefObject<boolean>;
}

export function useAnimation(): AnimationHookResult {
    const animationRef = useRef<number | null>(null);
    const isAnimating = useRef<boolean>(false);

    const stopAnimation = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        isAnimating.current = false;
    }, []);

    const startAnimation = useCallback(
        (animationCallback: () => void) => {
            // Stop any existing animation
            stopAnimation();

            isAnimating.current = true;

            const animate = () => {
                if (!isAnimating.current) return;

                animationCallback();
                animationRef.current = requestAnimationFrame(animate);
            };

            animationRef.current = requestAnimationFrame(animate);
        },
        [stopAnimation]
    );

    // Clean up on unmount
    useEffect(() => {
        return () => {
            stopAnimation();
        };
    }, [stopAnimation]);

    return {
        startAnimation,
        stopAnimation,
        isAnimating,
    };
}
