import React, { useEffect, useRef } from 'react';
import { VoronoiHoneycombBase } from '../core/VoronoiHoneycombBase';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { VoronoiHoneycombProps, HoneycombConfig } from '../config/types';
import { DEFAULT_CONFIG } from '../config/animation';

export function StaticVoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    noiseAmount = 0.3,
    showDebug = false,
}: VoronoiHoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const honeycombRef = useRef<VoronoiHoneycombBase | null>(null);

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
        };

        // Create honeycomb instance
        const honeycomb = new VoronoiHoneycombBase(
            config,
            context,
            dimensions.width,
            dimensions.height
        );

        // Initialize and render once
        honeycomb.initialize();
        honeycomb.renderFrame();

        honeycombRef.current = honeycomb;

        return () => {
            honeycomb.destroy();
            honeycombRef.current = null;
        };
    }, [context, dimensions, numPoints, noiseAmount, showDebug]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{
                background: DEFAULT_CONFIG.colors.background,
                display: 'block',
                width: '100%',
                height: '100%',
            }}
        />
    );
}
