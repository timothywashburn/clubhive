import { createNoise2D } from 'simplex-noise';
import { ColorData, HoneycombColors } from '../config/types.ts';
import { GENERATION_CONFIG } from '../config/animation.ts';
import { hexToHsl } from '../config/utils.ts';

export class ColorCalculator {
    private colors: HoneycombColors;
    private noise2D: ReturnType<typeof createNoise2D>;

    constructor(colors: HoneycombColors) {
        this.colors = colors;
        this.noise2D = createNoise2D();
    }

    calculateStaticColorData(points: [number, number][]): ColorData[] {
        const randomOffsets = points.map(() => (Math.random() - 0.5) * this.colors.honeycomb.randomLightnessRange);

        return points.map((point, i) => {
            const baseCentroid = point;
            const colorNoise = this.noise2D(baseCentroid[0] / GENERATION_CONFIG.noiseScale, baseCentroid[1] / GENERATION_CONFIG.noiseScale);
            const randomLightnessOffset = randomOffsets[i];

            const baseHue = this.colors.honeycomb.baseHue + colorNoise * this.colors.honeycomb.hueVariation;
            const baseSaturation = this.colors.honeycomb.baseSaturation + colorNoise * this.colors.honeycomb.saturationVariation;
            const baseLightness = Math.max(
                0,
                Math.min(
                    100,
                    this.colors.honeycomb.baseLightness + colorNoise * this.colors.honeycomb.lightnessVariation + randomLightnessOffset
                )
            );

            const totalDarknessFactor = this.calculateBlendFactor(baseLightness);
            const innerColor = this.blendTowardsTargetColor(baseHue, baseSaturation, baseLightness, totalDarknessFactor);

            const outerBlendFactor = Math.min(1, totalDarknessFactor + this.colors.animation.outerBlendOffset);
            const outerColor = this.blendTowardsTargetColor(baseHue, baseSaturation, baseLightness, outerBlendFactor);

            const innerColorString = `hsl(${innerColor.hue}, ${innerColor.saturation}%, ${innerColor.lightness}%)`;
            const outerColorString = `hsl(${outerColor.hue}, ${outerColor.saturation}%, ${outerColor.lightness}%)`;

            return {
                baseHue,
                baseSaturation,
                baseLightness,
                colorNoise,
                randomLightnessOffset,
                innerColor,
                outerColor,
                innerColorString,
                outerColorString,
                edgeColorString: this.colors.honeycomb.edgeStroke,
            };
        });
    }

    private calculateBlendFactor(lightness: number): number {
        return 1 - lightness / 80;
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
            saturation: baseSaturation + (targetHsl.saturation - baseSaturation) * blendFactor,
            lightness: baseLightness + (targetHsl.lightness - baseLightness) * blendFactor,
        };
    }
}
