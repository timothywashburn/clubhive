import { useEffect, useRef, useState, useCallback } from 'react';

export interface CanvasDimensions {
    width: number;
    height: number;
}

export interface CanvasSetupResult {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    dimensions: CanvasDimensions;
    context: CanvasRenderingContext2D | null;
}

export function useCanvasSetup(): CanvasSetupResult {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const lastDimensionsRef = useRef<{ width: number; height: number } | null>(null);
    const [dimensions, setDimensions] = useState<CanvasDimensions>({
        width: typeof window !== 'undefined' ? window.innerWidth : 1200,
        height: typeof window !== 'undefined' ? window.innerHeight * 1.5 : 800,
    });
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    const updateCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get the actual display size of the canvas
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Check if dimensions actually changed to prevent feedback loops
        const newWidth = rect.width;
        const newHeight = rect.height;
        const lastDimensions = lastDimensionsRef.current;

        if (lastDimensions && Math.abs(lastDimensions.width - newWidth) < 1 && Math.abs(lastDimensions.height - newHeight) < 1) return;

        // Set the internal size to the display size * device pixel ratio
        canvas.width = newWidth * dpr;
        canvas.height = newHeight * dpr;

        // Scale the context back down by the device pixel ratio
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            setContext(ctx);
        }

        // Update dimensions state and cache
        const newDimensions = { width: newWidth, height: newHeight };
        lastDimensionsRef.current = newDimensions;
        setDimensions(newDimensions);
    }, []);

    // Initialize canvas and set up resize observation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Initial setup
        updateCanvasSize();

        // Set up ResizeObserver to watch the canvas element directly
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserverRef.current = new ResizeObserver(entries => {
                for (const entry of entries) {
                    if (entry.target === canvas) {
                        updateCanvasSize();
                    }
                }
            });
            resizeObserverRef.current.observe(canvas);
        }

        // Fallback for browsers without ResizeObserver
        const handleResize = () => updateCanvasSize();
        window.addEventListener('resize', handleResize);

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [updateCanvasSize]);

    return {
        canvasRef,
        dimensions,
        context,
    };
}
