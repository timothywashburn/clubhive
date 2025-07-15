import { useEffect, useRef, useState } from 'react';

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
    const [dimensions, setDimensions] = useState<CanvasDimensions>({
        width: 1200,
        height: 800,
    });
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(
        null
    );

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight * 1.5, // 150vh equivalent for scrollable content
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get actual container size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        setContext(ctx);
    }, [dimensions]);

    return {
        canvasRef,
        dimensions,
        context,
    };
}
