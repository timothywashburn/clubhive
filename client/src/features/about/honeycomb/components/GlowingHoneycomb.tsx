import React, { useEffect, useRef } from 'react';
import { PointGenerator } from '../core/PointGenerator';
import { GlowingColorCalculator } from '../core/GlowingColorCalculator.ts';
import { HoneycombRenderer } from '../core/HoneycombRenderer';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { useMouseTracking } from '../hooks/useMouseTracking';
import { useAnimation } from '../hooks/useAnimation';
import { HoneycombProps, HoneycombConfig, HoneycombColors } from '../config/types';
import { MUTED_COLORS, VIBRANT_COLORS } from '../config/colors';
import { DEFAULT_CONFIG } from '../config/animation';

class GlowingHoneycombEngine {
    private pointGenerator: PointGenerator;
    private colorCalculator: GlowingColorCalculator;
    private renderer: HoneycombRenderer;
    private config: HoneycombConfig;
    private glowRadius: number;
    private extendedBounds: [number, number, number, number] = [0, 0, 0, 0];
    private basePoints: [number, number][] = [];
    private staticRandomOffsets: number[] = [];

    constructor(
        config: HoneycombConfig,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        mutedColors: HoneycombColors,
        vibrantColors: HoneycombColors,
        glowRadius: number,
        activationChance: number,
        glowSpeed: number,
        fadeSpeed: number
    ) {
        this.config = config;
        this.glowRadius = glowRadius;
        this.pointGenerator = new PointGenerator(width, height, config.numPoints, config.noiseAmount);
        this.colorCalculator = new GlowingColorCalculator(mutedColors, vibrantColors, glowRadius, activationChance, glowSpeed, fadeSpeed);
        // Use muted colors for the renderer
        this.renderer = new HoneycombRenderer(ctx, width, height, mutedColors, config.showDebug);
    }

    initialize(): void {
        // Generate hexagonal grid points
        this.basePoints = this.pointGenerator.generateHexagonalGrid();

        // Initialize glow states for each point
        this.colorCalculator.initializeGlowStates(this.basePoints.length);

        // Pre-calculate static random offsets for consistent color variation
        this.staticRandomOffsets = this.basePoints.map(() => (Math.random() - 0.5) * this.config.colors.honeycomb.randomLightnessRange);

        // Get extended bounds for Voronoi diagram
        this.extendedBounds = this.pointGenerator.getExtendedBounds();
    }

    animate(mousePosition: { x: number; y: number }): void {
        // Calculate dynamic color data with glow effects
        const dynamicColorData = this.colorCalculator.calculateDynamicColorData(this.basePoints, mousePosition, this.staticRandomOffsets);

        // Render frame with dynamic colors
        if (this.config.showDebug) {
            this.renderer.renderWithDebug(
                this.basePoints,
                this.basePoints, // No physics movement, just glow effects
                this.extendedBounds,
                dynamicColorData,
                mousePosition,
                this.glowRadius
            );
        } else {
            this.renderer.render(this.basePoints, this.extendedBounds, dynamicColorData);
        }
    }

    updateGlowRadius(radius: number): void {
        this.colorCalculator.updateGlowRadius(radius);
    }

    updateGlowSettings(activationChance: number, glowSpeed: number, fadeSpeed: number): void {
        this.colorCalculator.updateGlowSettings(activationChance, glowSpeed, fadeSpeed);
    }

    destroy(): void {
        this.basePoints = [];
        this.staticRandomOffsets = [];
    }
}

interface GlowingHoneycombProps extends HoneycombProps {
    glowRadius: number;
    activationChance: number;
    glowSpeed: number;
    fadeSpeed: number;
    decayChance: number;
    mutedColors: HoneycombColors;
    vibrantColors: HoneycombColors;
}

export function GlowingHoneycomb({
    className = '',
    numPoints,
    noiseAmount,
    showDebug,
    glowRadius,
    activationChance,
    glowSpeed,
    fadeSpeed,
    decayChance,
    mutedColors,
    vibrantColors,
}: GlowingHoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const { mousePosition } = useMouseTracking(canvasRef);
    const { startAnimation, stopAnimation } = useAnimation();
    const honeycombRef = useRef<GlowingHoneycombEngine | null>(null);

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
            colors: mutedColors, // Use muted as base config
        };

        // Create glowing honeycomb instance
        const honeycomb = new GlowingHoneycombEngine(
            config,
            context,
            dimensions.width,
            dimensions.height,
            mutedColors,
            vibrantColors,
            glowRadius,
            activationChance,
            glowSpeed,
            fadeSpeed
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
    }, [
        context,
        dimensions,
        numPoints,
        noiseAmount,
        showDebug,
        glowRadius,
        activationChance,
        glowSpeed,
        fadeSpeed,
        decayChance,
        mutedColors,
        vibrantColors,
        startAnimation,
        stopAnimation,
        mousePosition,
    ]);

    // Update glow settings when they change
    useEffect(() => {
        if (honeycombRef.current) {
            honeycombRef.current.updateGlowRadius(glowRadius);
            honeycombRef.current.updateGlowSettings(activationChance, glowSpeed, fadeSpeed);
        }
    }, [glowRadius, activationChance, glowSpeed, fadeSpeed]);

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
