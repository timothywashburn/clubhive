import React, { useEffect, useRef } from 'react';
import { PointGenerator } from '../core/PointGenerator';
import { ColorMorphingCalculator } from '../core/ColorMorphingCalculator';
import { HoneycombRenderer } from '../core/HoneycombRenderer';
import { useCanvasSetup } from '../hooks/useCanvasSetup';
import { useMouseTracking } from '../hooks/useMouseTracking';
import { useAnimation } from '../hooks/useAnimation';
import { VoronoiHoneycombProps, HoneycombConfig, VoronoiColors } from '../config/types';
import { MUTED_COLORS, VIBRANT_COLORS } from '../config/colors';
import { DEFAULT_CONFIG } from '../config/animation';

class ColorMorphingHoneycombEngine {
    private pointGenerator: PointGenerator;
    private colorCalculator: ColorMorphingCalculator;
    private renderer: HoneycombRenderer;
    private config: HoneycombConfig;
    private extendedBounds: [number, number, number, number] = [0, 0, 0, 0];
    private basePoints: [number, number][] = [];
    private staticRandomOffsets: number[] = [];

    constructor(
        config: HoneycombConfig,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        mutedColors: VoronoiColors,
        vibrantColors: VoronoiColors,
        morphRadius: number = 300
    ) {
        this.config = config;
        this.pointGenerator = new PointGenerator(
            width,
            height,
            config.numPoints,
            config.noiseAmount
        );
        this.colorCalculator = new ColorMorphingCalculator(
            mutedColors,
            vibrantColors,
            width,
            height,
            morphRadius
        );
        // Use muted colors for the renderer (won't affect dynamic colors)
        this.renderer = new HoneycombRenderer(
            ctx,
            width,
            height,
            mutedColors,
            config.showDebug
        );
    }

    initialize(): void {
        // Generate hexagonal grid points
        this.basePoints = this.pointGenerator.generateHexagonalGrid();
        
        // Pre-calculate static random offsets for consistent color variation
        this.staticRandomOffsets = this.basePoints.map(
            () => (Math.random() - 0.5) * this.config.colors.honeycomb.randomLightnessRange
        );
        
        // Get extended bounds for Voronoi diagram
        this.extendedBounds = this.pointGenerator.getExtendedBounds();
    }

    animate(mousePosition: { x: number; y: number }): void {
        // Calculate dynamic color data based on mouse position
        const dynamicColorData = this.colorCalculator.calculateDynamicColorData(
            this.basePoints,
            mousePosition,
            this.staticRandomOffsets
        );
        
        // Render frame with dynamic colors
        if (this.config.showDebug) {
            this.renderer.renderWithDebug(
                this.basePoints,
                this.basePoints, // No physics movement, just color morphing
                this.extendedBounds,
                dynamicColorData,
                mousePosition,
                300 // morphRadius for debug display
            );
        } else {
            this.renderer.render(
                this.basePoints,
                this.extendedBounds,
                dynamicColorData
            );
        }
    }

    updateMorphRadius(radius: number): void {
        this.colorCalculator.updateMorphRadius(radius);
    }

    destroy(): void {
        this.basePoints = [];
        this.staticRandomOffsets = [];
    }
}

interface ColorMorphingHoneycombProps extends VoronoiHoneycombProps {
    morphRadius?: number;
    mutedColors?: VoronoiColors;
    vibrantColors?: VoronoiColors;
}

export function ColorMorphingHoneycomb({
    className = '',
    numPoints = 1000,
    noiseAmount = 0.3,
    showDebug = false,
    morphRadius = 300,
    mutedColors = MUTED_COLORS,
    vibrantColors = VIBRANT_COLORS,
}: ColorMorphingHoneycombProps) {
    const { canvasRef, dimensions, context } = useCanvasSetup();
    const { mousePosition } = useMouseTracking(canvasRef);
    const { startAnimation, stopAnimation } = useAnimation();
    const honeycombRef = useRef<ColorMorphingHoneycombEngine | null>(null);

    useEffect(() => {
        if (!context || !dimensions.width || !dimensions.height) return;

        const config: HoneycombConfig = {
            ...DEFAULT_CONFIG,
            numPoints,
            noiseAmount,
            showDebug,
            colors: mutedColors, // Use muted as base config
        };

        // Create color morphing honeycomb instance
        const honeycomb = new ColorMorphingHoneycombEngine(
            config,
            context,
            dimensions.width,
            dimensions.height,
            mutedColors,
            vibrantColors,
            morphRadius
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
    }, [context, dimensions, numPoints, noiseAmount, showDebug, morphRadius, mutedColors, vibrantColors, startAnimation, stopAnimation, mousePosition]);

    // Update morph radius when it changes
    useEffect(() => {
        if (honeycombRef.current) {
            honeycombRef.current.updateMorphRadius(morphRadius);
        }
    }, [morphRadius]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{
                background: mutedColors.background,
                display: 'block',
                width: '100%',
                height: '100%',
            }}
        />
    );
}