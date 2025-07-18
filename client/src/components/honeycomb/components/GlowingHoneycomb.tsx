import React, { useEffect, useRef } from 'react';
import { PointGenerator } from '../core/PointGenerator.ts';
import { GlowingColorCalculator } from '../core/GlowingColorCalculator.ts';
import { HoneycombRenderer } from '../core/HoneycombRenderer.ts';
import { useCanvasSetup } from '../hooks/useCanvasSetup.ts';
import { useMouseTracking } from '../hooks/useMouseTracking.ts';
import { useAnimation } from '../hooks/useAnimation.ts';
import { HoneycombProps, HoneycombConfig, HoneycombColors } from '../config/types.ts';
import { DEFAULT_CONFIG } from '../config/animation.ts';
import { useHoneycombColors } from '../hooks/useHoneycombColors.ts';

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

        // Get glow intensities for sorting
        const glowIntensities = this.colorCalculator.getGlowIntensities();

        // Create sorted indices by glow intensity (low to high)
        const sortedIndices = Array.from({ length: this.basePoints.length }, (_, i) => i).sort(
            (a, b) => glowIntensities[a] - glowIntensities[b]
        );

        // Sort points and color data by glow intensity
        const sortedPoints = sortedIndices.map(i => this.basePoints[i]);
        const sortedColorData = sortedIndices.map(i => dynamicColorData[i]);

        // Render frame with sorted data (low glow intensity cells first)
        if (this.config.showDebug) {
            this.renderer.renderWithDebug(
                sortedPoints,
                sortedPoints, // No physics movement, just glow effects
                this.extendedBounds,
                sortedColorData,
                mousePosition,
                this.glowRadius
            );
        } else {
            this.renderer.render(sortedPoints, this.extendedBounds, sortedColorData);
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
}: GlowingHoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const { mousePosition } = useMouseTracking(canvasRef);
    const { startAnimation, stopAnimation } = useAnimation();
    const honeycombRef = useRef<GlowingHoneycombEngine | null>(null);
    const { baseColors, vibrantColors } = useHoneycombColors();

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
            colors: baseColors,
        };

        // Create glowing honeycomb instance
        const honeycomb = new GlowingHoneycombEngine(
            config,
            context,
            dimensions.width,
            dimensions.height,
            baseColors,
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
        baseColors,
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
