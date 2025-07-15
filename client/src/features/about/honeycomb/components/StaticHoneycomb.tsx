import React, { useEffect, useRef } from 'react';
import { HoneycombBase } from '../core/HoneycombBase.ts';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { HoneycombProps, HoneycombConfig } from '../config/types';
import { DEFAULT_CONFIG } from '../config/animation';

export function StaticHoneycomb({
    className = '',
    numPoints,
    noiseAmount,
    showDebug,
}: HoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const honeycombRef = useRef<HoneycombBase | null>(null);

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
        };

        // Create honeycomb instance
        const honeycomb = new HoneycombBase(
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
                display: 'block',
                width: '100%',
                height: '100%',
            }}
        />
    );
}
