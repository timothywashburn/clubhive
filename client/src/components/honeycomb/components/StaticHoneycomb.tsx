import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HoneycombBase } from '../core';
import { useCanvasSetup } from '../hooks';
import { HoneycombProps, HoneycombConfig } from '../config';
import { DEFAULT_CONFIG } from '../config';
import { useHoneycombColors } from '../hooks';

interface StaticHoneycombProps extends HoneycombProps {
    x?: number;
    y?: number;
    scale?: number;
}

export function StaticHoneycomb({
    className = '',
    numPoints = 7000,
    noiseAmount = 0.25,
    showDebug = false,
    x = 0,
    y = 0,
    scale = 1,
}: StaticHoneycombProps) {
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
        <motion.div
            className="w-full h-full"
            animate={{ x, y, scale }}
            transition={{
                type: 'spring',
                damping: 20,
                stiffness: 70,
                duration: 1,
            }}
        >
            <canvas
                ref={canvasRef}
                className={`w-full h-full ${className}`}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                }}
            />
        </motion.div>
    );
}
