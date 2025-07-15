import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import { createNoise2D } from 'simplex-noise';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    relaxationSteps?: number;
    noiseAmount?: number;
    showDebug?: boolean;
}

export function VoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    relaxationSteps = 5,
    noiseAmount = 0.3,
    showDebug = true,
}: VoronoiHoneycombProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const animationRef = useRef<number>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const basePointsRef = useRef<[number, number][]>([]);
    const currentPointsRef = useRef<[number, number][]>([]);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get actual container size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        generateAndDrawHoneycomb(ctx, canvas.width, canvas.height);

        // Add global mouse event listeners for jelly interaction (works through text)
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        // Use window instead of canvas to detect mouse through text elements
        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [dimensions, numPoints, relaxationSteps, noiseAmount, showDebug]);

    // Clean up previous animation
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const generateAndDrawHoneycomb = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
        // Clean up previous animation
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        // Extend the generation area beyond screen boundaries to ensure proper edge cells
        const margin = Math.max(width, height) * 0.2; // 20% margin on all sides
        const extendedWidth = width + 2 * margin;
        const extendedHeight = height + 2 * margin;

        // Generate points in a hexagonal grid pattern with noise
        const points: [number, number][] = [];

        // Calculate spacing based on desired number of points
        const targetDensity = numPoints / (extendedWidth * extendedHeight);
        const hexSpacing = Math.sqrt(2 / (Math.sqrt(3) * targetDensity));
        const rowHeight = (hexSpacing * Math.sqrt(3)) / 2;

        // Generate hexagonal grid with noise
        const actualNoiseAmount = hexSpacing * noiseAmount;

        for (let row = 0; row * rowHeight < extendedHeight + margin; row++) {
            const y = row * rowHeight - margin;
            const isOddRow = row % 2 === 1;
            const xOffset = isOddRow ? hexSpacing / 2 : 0;

            for (
                let col = 0;
                col * hexSpacing < extendedWidth + margin;
                col++
            ) {
                const x = col * hexSpacing + xOffset - margin;

                // Add random noise to break perfect grid
                const noisyX = x + (Math.random() - 0.5) * actualNoiseAmount;
                const noisyY = y + (Math.random() - 0.5) * actualNoiseAmount;

                points.push([noisyX, noisyY]);
            }
        }

        const noise2D = createNoise2D();

        // Lloyd's Relaxation Algorithm with extended bounds (optional, can reduce steps since we start with better grid)
        const extendedBounds: [number, number, number, number] = [
            -margin,
            -margin,
            width + margin,
            height + margin,
        ];
        let currentPoints = points;
        for (let i = 0; i < relaxationSteps; i++) {
            const delaunay = Delaunay.from(currentPoints);
            const voronoi = delaunay.voronoi(extendedBounds);
            const newPoints: [number, number][] = [];

            for (let j = 0; j < currentPoints.length; j++) {
                const cell = voronoi.cellPolygon(j);
                if (cell) {
                    const centroid = d3.polygonCentroid(cell);
                    newPoints.push([centroid[0], centroid[1]]);
                } else {
                    newPoints.push(currentPoints[j]);
                }
            }
            currentPoints = newPoints;
        }

        // Store base points for spring physics and pre-calculate random offsets
        basePointsRef.current = currentPoints.map(
            p => [...p] as [number, number]
        );
        currentPointsRef.current = currentPoints.map(
            p => [...p] as [number, number]
        );

        // Pre-calculate random lightness offsets to prevent flickering
        const randomOffsets = currentPoints.map(
            () => (Math.random() - 0.5) * 15
        );

        // Manual physics system for continuous spring forces
        const velocities = currentPoints.map(() => ({ vx: 0, vy: 0 }));

        // Animation loop for manual jelly physics
        const animate = () => {
            const mouse = mouseRef.current;
            const mouseForce = 0.2;
            const mouseRadius = 600;
            const springStrength = 0.002;
            const damping = 0.8;
            // Apply forces to each point
            for (let i = 0; i < currentPointsRef.current.length; i++) {
                const current = currentPointsRef.current[i];
                const base = basePointsRef.current[i];
                const velocity = velocities[i];

                // Spring force towards base position (ALWAYS ACTIVE)
                const springX = (base[0] - current[0]) * springStrength;
                const springY = (base[1] - current[1]) * springStrength;

                // Mouse attraction force (suck in)
                let mouseForceX = 0;
                let mouseForceY = 0;
                if (mouse.x > -500) {
                    const dx = mouse.x - current[0];
                    const dy = mouse.y - current[1];
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseRadius && distance > 0) {
                        let force =
                            ((mouseRadius - distance) / mouseRadius) *
                            mouseForce;

                        const cutoff = 80;
                        const minDistance = 1;
                        const clampedDistance = Math.min(
                            Math.max(distance, minDistance),
                            cutoff
                        );
                        force *= clampedDistance / cutoff;

                        const angle = Math.atan2(dy, dx);
                        mouseForceX = Math.cos(angle) * force;
                        mouseForceY = Math.sin(angle) * force;
                    }
                }

                // Update velocity with forces
                velocity.vx = (velocity.vx + springX + mouseForceX) * damping;
                velocity.vy = (velocity.vy + springY + mouseForceY) * damping;

                // Update position
                current[0] += velocity.vx;
                current[1] += velocity.vy;
            }

            // Draw the Voronoi diagram with current points
            ctx.clearRect(0, 0, width, height);
            const delaunay = Delaunay.from(currentPointsRef.current);
            const voronoi = delaunay.voronoi(extendedBounds);

            // Clip rendering to the visible area
            ctx.save();
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.clip();

            for (let i = 0; i < currentPointsRef.current.length; i++) {
                const cell = voronoi.cellPolygon(i);
                if (cell) {
                    ctx.beginPath();
                    ctx.moveTo(cell[0][0], cell[0][1]);
                    for (let j = 1; j < cell.length; j++) {
                        ctx.lineTo(cell[j][0], cell[j][1]);
                    }
                    ctx.closePath();

                    // Use the base position for consistent colors
                    const baseCentroid = basePointsRef.current[i];
                    const colorNoise = noise2D(
                        baseCentroid[0] / 800,
                        baseCentroid[1] / 800
                    );

                    // Use pre-calculated random offset to prevent flickering
                    const randomLightnessOffset = randomOffsets[i];

                    const baseHue = 40 + colorNoise * 15;
                    const baseSaturation = 60 + colorNoise * 20;
                    const baseLightness = Math.max(
                        20,
                        Math.min(
                            80,
                            50 + colorNoise * 15 + randomLightnessOffset
                        )
                    );

                    // Calculate distance from edges for darkened ring effect
                    const distanceFromEdge = Math.min(
                        baseCentroid[0],
                        baseCentroid[1],
                        width - baseCentroid[0],
                        height - baseCentroid[1]
                    );
                    const edgeThreshold = Math.min(width, height) * 0.1;
                    const edgeFactor = Math.min(
                        1,
                        distanceFromEdge / edgeThreshold
                    );

                    // Extract color blending functions
                    const calculateBlendFactor = (
                        baseLightness: number,
                        edgeFactor: number
                    ) => {
                        const darknessFactor = 1 - baseLightness / 80;
                        const edgeDarknessFactor = 1 - (0.5 + 0.5 * edgeFactor);
                        return Math.min(1, darknessFactor + edgeDarknessFactor);
                    };

                    const blendTowardsEdgeColor = (
                        baseHue: number,
                        baseSaturation: number,
                        baseLightness: number,
                        blendFactor: number
                    ) => {
                        // Edge color HSL values for #502205
                        const edgeHue = 23;
                        const edgeSaturation = 88;
                        const edgeLightness = 17;

                        return {
                            hue: baseHue + (edgeHue - baseHue) * blendFactor,
                            saturation:
                                baseSaturation +
                                (edgeSaturation - baseSaturation) * blendFactor,
                            lightness:
                                baseLightness +
                                (edgeLightness - baseLightness) * blendFactor,
                        };
                    };

                    // Calculate blend factors and colors
                    const totalDarknessFactor = calculateBlendFactor(
                        baseLightness,
                        edgeFactor
                    );
                    const innerColor = blendTowardsEdgeColor(
                        baseHue,
                        baseSaturation,
                        baseLightness,
                        totalDarknessFactor
                    );

                    const outerBlendFactor = Math.min(
                        1,
                        totalDarknessFactor + 0.4
                    ); // More edge blending for outer ring
                    const outerColor = blendTowardsEdgeColor(
                        baseHue,
                        baseSaturation,
                        baseLightness,
                        outerBlendFactor
                    );

                    // Draw outer hexagon with edge-blended color
                    ctx.fillStyle = `hsl(${outerColor.hue}, ${outerColor.saturation}%, ${outerColor.lightness}%)`;
                    ctx.fill();

                    // Calculate the centroid of the cell for the inner hexagon
                    const centroid = d3.polygonCentroid(cell);

                    // Create inner hexagon path (scaled down from center)
                    const scaleFactor = 0.7; // Inner hexagon is 70% the size
                    const innerCell = cell.map(point => [
                        centroid[0] + (point[0] - centroid[0]) * scaleFactor,
                        centroid[1] + (point[1] - centroid[1]) * scaleFactor,
                    ]);

                    // Draw inner hexagon
                    ctx.beginPath();
                    ctx.moveTo(innerCell[0][0], innerCell[0][1]);
                    for (let j = 1; j < innerCell.length; j++) {
                        ctx.lineTo(innerCell[j][0], innerCell[j][1]);
                    }
                    ctx.closePath();

                    // Fill inner hexagon with blended color
                    ctx.fillStyle = `hsl(${innerColor.hue}, ${innerColor.saturation}%, ${innerColor.lightness}%)`;
                    ctx.fill();

                    // Draw outer edge
                    ctx.beginPath();
                    ctx.moveTo(cell[0][0], cell[0][1]);
                    for (let j = 1; j < cell.length; j++) {
                        ctx.lineTo(cell[j][0], cell[j][1]);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = `#4d1f09`;
                    ctx.lineWidth = 3.5;
                    ctx.stroke();
                }
            }

            // Debug: Draw the underlying points (only if enabled)
            if (showDebug) {
                ctx.save();
                for (let i = 0; i < currentPointsRef.current.length; i++) {
                    const point = currentPointsRef.current[i];
                    const basePoint = basePointsRef.current[i];

                    // Draw current position (red)
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
                    ctx.fill();

                    // Draw base position (blue)
                    ctx.fillStyle = 'blue';
                    ctx.beginPath();
                    ctx.arc(basePoint[0], basePoint[1], 2, 0, 2 * Math.PI);
                    ctx.fill();

                    // Draw connection line
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(basePoint[0], basePoint[1]);
                    ctx.lineTo(point[0], point[1]);
                    ctx.stroke();
                }

                // Draw mouse position
                const mousePos = mouseRef.current;
                if (mousePos.x > -500) {
                    ctx.fillStyle = 'lime';
                    ctx.beginPath();
                    ctx.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
                    ctx.fill();

                    // Draw mouse influence radius
                    ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(
                        mousePos.x,
                        mousePos.y,
                        mouseRadius,
                        0,
                        2 * Math.PI
                    );
                    ctx.stroke();
                }
                ctx.restore();
            }

            // Restore the clipping context
            ctx.restore();

            // Continue animation
            animationRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animate();
    };

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            style={{
                background: '#2c2c2c',
                display: 'block',
                width: '100%',
                height: '100%',
            }}
        />
    );
}
