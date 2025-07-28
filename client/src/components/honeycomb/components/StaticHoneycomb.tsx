import React, { useEffect, useRef } from 'react';
import { HoneycombBase } from '../core/HoneycombBase.ts';
import { useCanvasSetup } from '../hooks/useCanvasSetup.ts';
import { HoneycombProps, HoneycombConfig } from '../config/types.ts';
import { DEFAULT_CONFIG } from '../config/animation.ts';
import { useHoneycombColors } from '../hooks/useHoneycombColors.ts';

export function StaticHoneycomb({ className = '', numPoints = 7000, noiseAmount = 0.15, showDebug = false }: HoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const honeycombRef = useRef<HoneycombBase | null>(null);
    const { baseColors } = useHoneycombColors();

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
            colors: baseColors,
        };

        // Create honeycomb instance
        const honeycomb = new HoneycombBase(config, context, dimensions.width, dimensions.height);

        // Initialize and render once
        honeycomb.initialize();
        honeycomb.renderFrame();

        honeycombRef.current = honeycomb;

        return () => {
            honeycomb.destroy();
            honeycombRef.current = null;
        };
    }, [context, dimensions, numPoints, noiseAmount, showDebug, baseColors]);

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
