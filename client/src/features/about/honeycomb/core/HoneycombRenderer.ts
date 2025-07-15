import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';
import { ColorData, VoronoiColors, Point } from '../config/types';

export class HoneycombRenderer {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private colors: VoronoiColors;
    private showDebug: boolean;

    constructor(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        colors: VoronoiColors,
        showDebug: boolean = false
    ) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.colors = colors;
        this.showDebug = showDebug;
    }

    render(
        points: [number, number][],
        extendedBounds: [number, number, number, number],
        staticColorData: ColorData[]
    ): void {
        this.clear();

        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi(extendedBounds);

        // Clip rendering to the visible area
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.clip();

        this.renderCells(voronoi, points, staticColorData);

        this.ctx.restore();
    }

    renderWithDebug(
        points: [number, number][],
        basePoints: [number, number][],
        extendedBounds: [number, number, number, number],
        staticColorData: ColorData[],
        mousePosition: Point,
        mouseRadius: number
    ): void {
        this.render(points, extendedBounds, staticColorData);

        if (this.showDebug) {
            this.renderDebugInfo(
                points,
                basePoints,
                mousePosition,
                mouseRadius
            );
        }
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    private renderCells(
        voronoi: d3.Voronoi<[number, number]>,
        points: [number, number][],
        staticColorData: ColorData[]
    ): void {
        for (let i = 0; i < points.length; i++) {
            const cell = voronoi.cellPolygon(i);
            if (cell) {
                this.renderCell(cell, staticColorData[i]);
            }
        }
    }

    private renderCell(cell: [number, number][], colorData: ColorData): void {
        // Create cell path
        this.ctx.beginPath();
        this.ctx.moveTo(cell[0][0], cell[0][1]);
        for (let j = 1; j < cell.length; j++) {
            this.ctx.lineTo(cell[j][0], cell[j][1]);
        }
        this.ctx.closePath();

        // Draw outer hexagon with edge-blended color
        this.ctx.fillStyle = colorData.outerColorString;
        this.ctx.fill();

        // Calculate the centroid of the cell for the inner hexagon
        const centroid = d3.polygonCentroid(cell);

        // Create inner hexagon path (scaled down from center)
        const scaleFactor = this.colors.animation.innerHexagonScale;
        const innerCell = cell.map(point => [
            centroid[0] + (point[0] - centroid[0]) * scaleFactor,
            centroid[1] + (point[1] - centroid[1]) * scaleFactor,
        ]);

        // Draw inner hexagon
        this.ctx.beginPath();
        this.ctx.moveTo(innerCell[0][0], innerCell[0][1]);
        for (let j = 1; j < innerCell.length; j++) {
            this.ctx.lineTo(innerCell[j][0], innerCell[j][1]);
        }
        this.ctx.closePath();

        // Fill inner hexagon with blended color
        this.ctx.fillStyle = colorData.innerColorString;
        this.ctx.fill();

        // Draw outer edge
        this.ctx.beginPath();
        this.ctx.moveTo(cell[0][0], cell[0][1]);
        for (let j = 1; j < cell.length; j++) {
            this.ctx.lineTo(cell[j][0], cell[j][1]);
        }
        this.ctx.closePath();
        this.ctx.strokeStyle = colorData.edgeColorString;
        this.ctx.lineWidth = this.colors.animation.strokeWidth;
        this.ctx.stroke();
    }

    private renderDebugInfo(
        points: [number, number][],
        basePoints: [number, number][],
        mousePosition: Point,
        mouseRadius: number
    ): void {
        this.ctx.save();

        // Draw points and connections
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            const basePoint = basePoints[i];

            // Draw current position (red)
            this.ctx.fillStyle = this.colors.debug.currentPoint;
            this.ctx.beginPath();
            this.ctx.arc(point[0], point[1], 3, 0, 2 * Math.PI);
            this.ctx.fill();

            // Draw base position (blue)
            this.ctx.fillStyle = this.colors.debug.basePoint;
            this.ctx.beginPath();
            this.ctx.arc(basePoint[0], basePoint[1], 2, 0, 2 * Math.PI);
            this.ctx.fill();

            // Draw connection line
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.colors.debug.connectionLineOpacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(basePoint[0], basePoint[1]);
            this.ctx.lineTo(point[0], point[1]);
            this.ctx.stroke();
        }

        // Draw mouse position and influence radius
        if (mousePosition.x > -500) {
            this.ctx.fillStyle = this.colors.debug.mousePosition;
            this.ctx.beginPath();
            this.ctx.arc(mousePosition.x, mousePosition.y, 5, 0, 2 * Math.PI);
            this.ctx.fill();

            // Draw mouse influence radius
            this.ctx.strokeStyle = `rgba(0, 255, 0, ${this.colors.debug.mouseRadiusOpacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(
                mousePosition.x,
                mousePosition.y,
                mouseRadius,
                0,
                2 * Math.PI
            );
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    updateDebugMode(showDebug: boolean): void {
        this.showDebug = showDebug;
    }

    updateColors(colors: VoronoiColors): void {
        this.colors = colors;
    }
}
