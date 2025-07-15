import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import { createNoise2D } from 'simplex-noise';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    relaxationSteps?: number;
}

export function VoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    relaxationSteps = 5,
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
    }, [dimensions, numPoints, relaxationSteps]);

    const generateAndDrawHoneycomb = (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
        // Generate initial random points
        let points: [number, number][] = Array.from(
            { length: numPoints },
            () => [Math.random() * width, Math.random() * height]
        );

        const noise2D = createNoise2D();

        // Lloyd's Relaxation Algorithm
        const bounds: [number, number, number, number] = [0, 0, width, height];
        for (let i = 0; i < relaxationSteps; i++) {
            const delaunay = Delaunay.from(points);
            const voronoi = delaunay.voronoi(bounds);
            const newPoints: [number, number][] = [];

            for (let j = 0; j < points.length; j++) {
                const cell = voronoi.cellPolygon(j);
                if (cell) {
                    const centroid = d3.polygonCentroid(cell);
                    newPoints.push([centroid[0], centroid[1]]);
                } else {
                    newPoints.push(points[j]);
                }
            }
            points = newPoints;
        }

        // Draw the Voronoi diagram
        ctx.clearRect(0, 0, width, height);
        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi(bounds);

        for (let i = 0; i < points.length; i++) {
            const cell = voronoi.cellPolygon(i);
            if (cell) {
                ctx.beginPath();
                ctx.moveTo(cell[0][0], cell[0][1]);
                for (let j = 1; j < cell.length; j++) {
                    ctx.lineTo(cell[j][0], cell[j][1]);
                }
                ctx.closePath();

                // Use the cell's centroid for color calculation
                const centroid = points[i];
                const colorNoise = noise2D(
                    centroid[0] / 800,
                    centroid[1] / 800
                );

                const hue = 40 + colorNoise * 15; // Yellow-orange-gold range
                const saturation = 60 + colorNoise * 20;
                const lightness = 50 + colorNoise * 15;

                ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                ctx.fill();

                ctx.strokeStyle = `hsla(45, 20%, 10%, 0.5)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
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
