import React, { useEffect, useRef } from 'react';
import { HoneycombBase } from '../core/HoneycombBase.ts';
import { useCanvasSetup } from '../hooks/useCanvasSetup.ts';
import { useMouseTracking } from '../hooks/useMouseTracking.ts';
import { useAnimation } from '../hooks/useAnimation.ts';
import { HoneycombProps, HoneycombConfig } from '../config/types.ts';
import { DEFAULT_CONFIG } from '../config/animation.ts';
import { useHoneycombColors } from '../hooks/useHoneycombColors.ts';

class DynamicHoneycomb extends HoneycombBase {
    animate(mousePosition: { x: number; y: number }): void {
        // Update physics simulation
        this.physicsEngine.updatePhysics(mousePosition);

        // Render frame with debug info if enabled
        if (this.config.showDebug) {
            this.renderFrameWithDebug(mousePosition);
        } else {
            this.renderFrame();
        }
    }
}

export function DynamicHoneycombComponent({ className = '', numPoints, noiseAmount, showDebug }: HoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const { mousePosition } = useMouseTracking(canvasRef);
    const { startAnimation, stopAnimation } = useAnimation();
    const honeycombRef = useRef<DynamicHoneycomb | null>(null);
    const { baseColors: honeycombColors } = useHoneycombColors();

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
            colors: honeycombColors,
        };

        // Create dynamic honeycomb instance
        const honeycomb = new DynamicHoneycomb(config, context, dimensions.width, dimensions.height);

        // Initialize the honeycomb
        honeycomb.initialize();
        honeycombRef.current = honeycomb;

        // Start animation loop
        startAnimation(() => {
            honeycomb.animate(mousePosition.current);
        });

        return () => {
            stopAnimation();
            honeycomb.destroy();
            honeycombRef.current = null;
        };
    }, [context, dimensions, numPoints, noiseAmount, showDebug, honeycombColors, startAnimation, stopAnimation, mousePosition]);

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
