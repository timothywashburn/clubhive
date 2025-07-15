import { useEffect, useRef } from 'react';
import { Point } from '../config/types';

export interface MouseTrackingResult {
    mousePosition: React.MutableRefObject<Point>;
}

export function useMouseTracking(
    canvasRef: React.RefObject<HTMLCanvasElement>
): MouseTrackingResult {
    const mousePosition = useRef<Point>({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePosition.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mousePosition.current = { x: -1000, y: -1000 };
        };

        // Use window instead of canvas to detect mouse through text elements
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [canvasRef]);

    return {
        mousePosition,
    };
}
