import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import { createNoise2D } from 'simplex-noise';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    relaxationSteps?: number;
    noiseAmount?: number;
}

export function VoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    relaxationSteps = 5,
    noiseAmount = 0.3,
}: VoronoiHoneycombProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

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
    }, [dimensions, numPoints, relaxationSteps, noiseAmount]);

    const generateAndDrawHoneycomb = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
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

        // Draw the Voronoi diagram
        ctx.clearRect(0, 0, width, height);
        const delaunay = Delaunay.from(currentPoints);
        const voronoi = delaunay.voronoi(extendedBounds);

        // Clip rendering to the visible area
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, width, height);
        ctx.clip();

        for (let i = 0; i < currentPoints.length; i++) {
            const cell = voronoi.cellPolygon(i);
            if (cell) {
                ctx.beginPath();
                ctx.moveTo(cell[0][0], cell[0][1]);
                for (let j = 1; j < cell.length; j++) {
                    ctx.lineTo(cell[j][0], cell[j][1]);
                }
                ctx.closePath();

                // Use the cell's centroid for color calculation
                const centroid = currentPoints[i];
                const colorNoise = noise2D(
                    centroid[0] / 800,
                    centroid[1] / 800
                );

                // Add chaotic random lightness offset per honeycomb (keep hue in yellow range)
                const randomLightnessOffset = (Math.random() - 0.5) * 15; // ±15% lightness shift

                const baseHue = 40 + colorNoise * 15; // Keep in yellow-orange-gold range
                const baseSaturation = 60 + colorNoise * 20;
                const baseLightness = Math.max(
                    20,
                    Math.min(80, 50 + colorNoise * 15 + randomLightnessOffset)
                );

                // Calculate distance from edges for darkened ring effect
                const distanceFromEdge = Math.min(
                    centroid[0],
                    centroid[1],
                    width - centroid[0],
                    height - centroid[1]
                );
                const edgeThreshold = Math.min(width, height) * 0.1;
                const edgeFactor = Math.min(
                    1,
                    distanceFromEdge / edgeThreshold
                );

                // Calculate darkness factor (how much to blend towards edge color)
                const darknessFactor = 1 - baseLightness / 80; // 0 = bright, 1 = dark
                const edgeDarknessFactor = 1 - (0.5 + 0.5 * edgeFactor); // Additional darkening at screen edges
                const totalDarknessFactor = Math.min(
                    1,
                    darknessFactor + edgeDarknessFactor
                );

                // Edge color is approximately HSL(23°, 88%, 17%) for #502205
                const edgeHue = 23;
                const edgeSaturation = 88;
                const edgeLightness = 17;

                // Blend towards edge color based on darkness
                const finalHue =
                    baseHue + (edgeHue - baseHue) * totalDarknessFactor;
                const finalSaturation =
                    baseSaturation +
                    (edgeSaturation - baseSaturation) * totalDarknessFactor;
                const finalLightness =
                    baseLightness +
                    (edgeLightness - baseLightness) * totalDarknessFactor;

                // Draw main fill
                ctx.fillStyle = `hsl(${finalHue}, ${finalSaturation}%, ${finalLightness}%)`;
                ctx.fill();

                // Draw intermediate ring (darker than fill, lighter than edge)
                // ctx.strokeStyle = `#913500`;
                // ctx.lineWidth = 15; // Thicker ring underneath
                // ctx.stroke();

                // Draw main edge
                ctx.strokeStyle = `#502205`;
                ctx.lineWidth = 3.5;
                ctx.stroke();
            }
        }

        // Restore the clipping context
        ctx.restore();
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
