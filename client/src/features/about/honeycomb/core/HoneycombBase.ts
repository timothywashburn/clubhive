import { PointGenerator } from './PointGenerator';
import { ColorCalculator } from './ColorCalculator';
import { PhysicsEngine } from './PhysicsEngine';
import { HoneycombRenderer } from './HoneycombRenderer';
import { HoneycombConfig, ColorData } from '../config/types';

export class HoneycombBase {
    protected pointGenerator: PointGenerator;
    protected colorCalculator: ColorCalculator;
    protected physicsEngine: PhysicsEngine;
    protected renderer: HoneycombRenderer;
    protected config: HoneycombConfig;
    protected staticColorData: ColorData[] = [];
    protected extendedBounds: [number, number, number, number] = [0, 0, 0, 0];

    constructor(
        config: HoneycombConfig,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) {
        this.config = config;
        this.pointGenerator = new PointGenerator(
            width,
            height,
            config.numPoints,
            config.noiseAmount
        );
        this.colorCalculator = new ColorCalculator(
            config.colors,
            width,
            height
        );
        this.physicsEngine = new PhysicsEngine(config.physics);
        this.renderer = new HoneycombRenderer(
            ctx,
            width,
            height,
            config.colors,
            config.showDebug
        );
    }

    initialize(): void {
        // Generate hexagonal grid points
        const points = this.pointGenerator.generateHexagonalGrid();

        // Initialize physics engine with points
        this.physicsEngine.initialize(points);

        // Calculate static color data
        this.staticColorData =
            this.colorCalculator.calculateStaticColorData(points);

        // Get extended bounds for Voronoi diagram
        this.extendedBounds = this.pointGenerator.getExtendedBounds();
    }

    renderFrame(): void {
        const currentPoints = this.physicsEngine.getCurrentPoints();

        this.renderer.render(
            currentPoints,
            this.extendedBounds,
            this.staticColorData
        );
    }

    protected renderFrameWithDebug(mousePosition: {
        x: number;
        y: number;
    }): void {
        const currentPoints = this.physicsEngine.getCurrentPoints();
        const basePoints = this.physicsEngine.getBasePoints();

        this.renderer.renderWithDebug(
            currentPoints,
            basePoints,
            this.extendedBounds,
            this.staticColorData,
            mousePosition,
            this.config.physics.mouseRadius
        );
    }

    updateConfig(newConfig: Partial<HoneycombConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.colors) {
            this.renderer.updateColors(newConfig.colors);
        }

        if (newConfig.showDebug !== undefined) {
            this.renderer.updateDebugMode(newConfig.showDebug);
        }
    }

    destroy(): void {
        // Clean up any resources if needed
        this.staticColorData = [];
    }

    getConfig(): HoneycombConfig {
        return this.config;
    }

    getStaticColorData(): ColorData[] {
        return this.staticColorData;
    }

    getExtendedBounds(): [number, number, number, number] {
        return this.extendedBounds;
    }
}
