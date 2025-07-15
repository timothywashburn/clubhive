import React, { useEffect, useRef } from 'react';
import { VoronoiHoneycombBase } from '../core/VoronoiHoneycombBase';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { useMouseTracking } from '../hooks/useMouseTracking';
import { useAnimation } from '../hooks/useAnimation';
import { VoronoiHoneycombProps, HoneycombConfig } from '../config/types';
import { DEFAULT_CONFIG } from '../config/animation';

class DynamicVoronoiHoneycomb extends VoronoiHoneycombBase {
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

export function DynamicVoronoiHoneycombComponent({
    className = '',
    numPoints = 1000,
    noiseAmount = 0.3,
    showDebug = false,
}: VoronoiHoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const { mousePosition } = useMouseTracking(canvasRef);
    const { startAnimation, stopAnimation } = useAnimation();
    const honeycombRef = useRef<DynamicVoronoiHoneycomb | null>(null);

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
        };

        // Create dynamic honeycomb instance
        const honeycomb = new DynamicVoronoiHoneycomb(
            config,
            context,
            dimensions.width,
            dimensions.height
        );

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
    }, [context, dimensions, numPoints, noiseAmount, showDebug, startAnimation, stopAnimation, mousePosition]);

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