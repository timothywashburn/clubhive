import { createNoise2D } from 'simplex-noise';
import { ColorData, VoronoiColors, HoneycombColors } from '../config/types';
import { GENERATION_CONFIG } from '../config/animation';
import { hexToHsl } from '../config/utils';

export class ColorCalculator {
    private colors: VoronoiColors;
    private width: number;
    private height: number;
    private noise2D: ReturnType<typeof createNoise2D>;
    private edgeThreshold: number;

    constructor(colors: VoronoiColors, width: number, height: number) {
        this.colors = colors;
        this.width = width;
        this.height = height;
        this.noise2D = createNoise2D();
        this.edgeThreshold =
            Math.min(width, height) * GENERATION_CONFIG.edgeThresholdRatio;
    }

    calculateStaticColorData(points: [number, number][]): ColorData[] {
        const randomOffsets = points.map(
            () =>
                (Math.random() - 0.5) *
                this.colors.honeycomb.randomLightnessRange
        );

        return points.map((point, i) => {
            const baseCentroid = point;
            const colorNoise = this.noise2D(
                baseCentroid[0] / GENERATION_CONFIG.noiseScale,
                baseCentroid[1] / GENERATION_CONFIG.noiseScale
            );
            const randomLightnessOffset = randomOffsets[i];

            const baseHue =
                this.colors.honeycomb.baseHue +
                colorNoise * this.colors.honeycomb.hueVariation;
            const baseSaturation =
                this.colors.honeycomb.baseSaturation +
                colorNoise * this.colors.honeycomb.saturationVariation;
            const baseLightness = Math.max(
                this.colors.honeycomb.minLightness,
                Math.min(
                    this.colors.honeycomb.maxLightness,
                    this.colors.honeycomb.baseLightness +
                        colorNoise * this.colors.honeycomb.lightnessVariation +
                        randomLightnessOffset
                )
            );

            const distanceFromEdge = Math.min(
                baseCentroid[0],
                baseCentroid[1],
                this.width - baseCentroid[0],
                this.height - baseCentroid[1]
            );
            const edgeFactor = Math.min(
                1,
                distanceFromEdge / this.edgeThreshold
            );

            const totalDarknessFactor = this.calculateBlendFactor(
                baseLightness,
                edgeFactor
            );
            const innerColor = this.blendTowardsTargetColor(
                baseHue,
                baseSaturation,
                baseLightness,
                totalDarknessFactor
            );

            const outerBlendFactor = Math.min(
                1,
                totalDarknessFactor + this.colors.animation.outerBlendOffset
            );
            const outerColor = this.blendTowardsTargetColor(
                baseHue,
                baseSaturation,
                baseLightness,
                outerBlendFactor
            );

            const innerColorString = `hsl(${innerColor.hue}, ${innerColor.saturation}%, ${innerColor.lightness}%)`;
            const outerColorString = `hsl(${outerColor.hue}, ${outerColor.saturation}%, ${outerColor.lightness}%)`;

            return {
                baseHue,
                baseSaturation,
                baseLightness,
                colorNoise,
                randomLightnessOffset,
                edgeFactor,
                innerColor,
                outerColor,
                innerColorString,
                outerColorString,
                edgeColorString: this.colors.honeycomb.edgeStroke,
            };
        });
    }

    private calculateBlendFactor(
        baseLightness: number,
        edgeFactor: number
    ): number {
        const darknessFactor = 1 - baseLightness / 80;
        const edgeDarknessFactor = 1 - (0.5 + 0.5 * edgeFactor);
        return Math.min(1, darknessFactor + edgeDarknessFactor);
    }

    private blendTowardsTargetColor(
        baseHue: number,
        baseSaturation: number,
        baseLightness: number,
        blendFactor: number
    ): { hue: number; saturation: number; lightness: number } {
        const targetHsl = hexToHsl(this.colors.honeycomb.blendTargetColor);

        return {
            hue: baseHue + (targetHsl.hue - baseHue) * blendFactor,
            saturation:
                baseSaturation +
                (targetHsl.saturation - baseSaturation) * blendFactor,
            lightness:
                baseLightness +
                (targetHsl.lightness - baseLightness) * blendFactor,
        };
    }
}
