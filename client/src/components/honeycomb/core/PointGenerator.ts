import { GENERATION_CONFIG } from '../config';

export class PointGenerator {
    private readonly width: number;
    private readonly height: number;
    private readonly numPoints: number;
    private readonly noiseAmount: number;
    private readonly margin: number;
    private readonly extendedWidth: number;
    private readonly extendedHeight: number;

    constructor(width: number, height: number, numPoints: number, noiseAmount: number) {
        this.width = width;
        this.height = height;
        this.numPoints = numPoints;
        this.noiseAmount = noiseAmount;
        this.margin = Math.max(width, height) * GENERATION_CONFIG.margin;
        this.extendedWidth = width + 2 * this.margin;
        this.extendedHeight = height + 2 * this.margin;
    }

    generateHexagonalGrid(): [number, number][] {
        const points: [number, number][] = [];

        // Calculate spacing based on desired number of points
        const targetDensity = this.numPoints / (this.extendedWidth * this.extendedHeight);
        const hexSpacing = Math.sqrt(2 / (Math.sqrt(3) * targetDensity));
        const rowHeight = (hexSpacing * Math.sqrt(3)) / 2;

        // Generate hexagonal grid with noise
        const actualNoiseAmount = hexSpacing * this.noiseAmount;

        for (let row = 0; row * rowHeight < this.extendedHeight + this.margin; row++) {
            const y = row * rowHeight - this.margin;
            const isOddRow = row % 2 === 1;
            const xOffset = isOddRow ? hexSpacing / 2 : 0;

            for (let col = 0; col * hexSpacing < this.extendedWidth + this.margin; col++) {
                const x = col * hexSpacing + xOffset - this.margin;

                // Add random noise to break perfect grid
                const noisyX = x + (Math.random() - 0.5) * actualNoiseAmount;
                const noisyY = y + (Math.random() - 0.5) * actualNoiseAmount;

                points.push([noisyX, noisyY]);
            }
        }

        return points;
    }

    getExtendedBounds(): [number, number, number, number] {
        return [-this.margin, -this.margin, this.width + this.margin, this.height + this.margin];
    }

    getMargin(): number {
        return this.margin;
    }

    static copyPoints(points: [number, number][]): [number, number][] {
        return points.map(p => [...p] as [number, number]);
    }
}
