import { PointGenerator } from './PointGenerator.ts';
import { ColorCalculator } from './ColorCalculator.ts';
import { HoneycombRenderer } from './HoneycombRenderer.ts';
import { HoneycombConfig, ColorData } from '../config';

export class HoneycombBase {
    protected pointGenerator: PointGenerator;
    protected colorCalculator: ColorCalculator;
    protected renderer: HoneycombRenderer;
    protected config: HoneycombConfig;
    protected staticColorData: ColorData[] = [];
    protected extendedBounds: [number, number, number, number] = [0, 0, 0, 0];

    protected points: [number, number][] = [];

    constructor(config: HoneycombConfig, ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.config = config;
        this.pointGenerator = new PointGenerator(width, height, config.numPoints, config.noiseAmount);
        this.colorCalculator = new ColorCalculator(config.colors);
        this.renderer = new HoneycombRenderer(ctx, width, height, config.colors, config.showDebug);
    }

    initialize(): void {
        // Generate hexagonal grid points
        this.points = this.pointGenerator.generateHexagonalGrid();

        // Calculate static color data
        this.staticColorData = this.colorCalculator.calculateStaticColorData(this.points);

        // Get extended bounds for Voronoi diagram
        this.extendedBounds = this.pointGenerator.getExtendedBounds();
    }

    renderFrame(): void {
        this.renderer.render(this.points, this.extendedBounds, this.staticColorData);
    }

    protected renderFrameWithDebug(mousePosition: { x: number; y: number }): void {
        this.renderer.renderWithDebug(
            this.points,
            this.points,
            this.extendedBounds,
            this.staticColorData,
            mousePosition,
            this.config.physics.mouseRadius
        );
    }

    updateConfig(newConfig: Partial<HoneycombConfig>): void {
        this.config = { ...this.config, ...newConfig };
        if (newConfig.colors) this.renderer.updateColors(newConfig.colors);
        if (newConfig.showDebug !== undefined) this.renderer.updateDebugMode(newConfig.showDebug);
    }

    resize(width: number, height: number): void {
        this.pointGenerator = new PointGenerator(width, height, this.config.numPoints, this.config.noiseAmount);

        this.renderer.resize(width, height);

        this.points = this.pointGenerator.generateHexagonalGrid();
        this.staticColorData = this.colorCalculator.calculateStaticColorData(this.points);
        this.extendedBounds = this.pointGenerator.getExtendedBounds();
    }

    destroy(): void {
        this.staticColorData = [];
    }
}
