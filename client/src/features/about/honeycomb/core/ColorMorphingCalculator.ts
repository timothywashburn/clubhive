import { createNoise2D } from 'simplex-noise';
import { ColorData, VoronoiColors, HoneycombColors, Point } from '../config/types';
import { GENERATION_CONFIG } from '../config/animation';
import { hexToHsl } from '../config/utils';

export class ColorMorphingCalculator {
    private mutedColors: VoronoiColors;
    private vibrantColors: VoronoiColors;
    private width: number;
    private height: number;
    private noise2D: ReturnType<typeof createNoise2D>;
    private edgeThreshold: number;
    private morphRadius: number;
    private mutedTargetHsl: { hue: number; saturation: number; lightness: number };
    private vibrantTargetHsl: { hue: number; saturation: number; lightness: number };

    constructor(
        mutedColors: VoronoiColors, 
        vibrantColors: VoronoiColors, 
        width: number, 
        height: number,
        morphRadius: number = 300
    ) {
        this.mutedColors = mutedColors;
        this.vibrantColors = vibrantColors;
        this.width = width;
        this.height = height;
        this.noise2D = createNoise2D();
        this.edgeThreshold = Math.min(width, height) * GENERATION_CONFIG.edgeThresholdRatio;
        this.morphRadius = morphRadius;
        
        // Pre-calculate target HSL values to avoid repeated hex->HSL conversion
        this.mutedTargetHsl = hexToHsl(mutedColors.honeycomb.blendTargetColor);
        this.vibrantTargetHsl = hexToHsl(vibrantColors.honeycomb.blendTargetColor);
    }

    calculateDynamicColorData(
        points: [number, number][], 
        mousePosition: Point,
        staticRandomOffsets: number[]
    ): ColorData[] {
        return points.map((point, i) => {
            const baseCentroid = point;
            const colorNoise = this.noise2D(
                baseCentroid[0] / GENERATION_CONFIG.noiseScale,
                baseCentroid[1] / GENERATION_CONFIG.noiseScale
            );
            const randomLightnessOffset = staticRandomOffsets[i];

            // Calculate distance from mouse to this point
            const dx = mousePosition.x - baseCentroid[0];
            const dy = mousePosition.y - baseCentroid[1];
            const distanceFromMouse = Math.sqrt(dx * dx + dy * dy);

            // Calculate morph factor (0 = muted, 1 = vibrant)
            let morphFactor = 0;
            if (mousePosition.x > -500 && distanceFromMouse < this.morphRadius) {
                morphFactor = 1 - (distanceFromMouse / this.morphRadius);
                morphFactor = Math.pow(morphFactor, 2); // Ease out for smoother transition
            }

            // Interpolate between muted and vibrant colors
            const baseHue = this.interpolateValue(
                this.mutedColors.honeycomb.baseHue,
                this.vibrantColors.honeycomb.baseHue,
                morphFactor
            ) + colorNoise * this.interpolateValue(
                this.mutedColors.honeycomb.hueVariation,
                this.vibrantColors.honeycomb.hueVariation,
                morphFactor
            );

            const baseSaturation = this.interpolateValue(
                this.mutedColors.honeycomb.baseSaturation,
                this.vibrantColors.honeycomb.baseSaturation,
                morphFactor
            ) + colorNoise * this.interpolateValue(
                this.mutedColors.honeycomb.saturationVariation,
                this.vibrantColors.honeycomb.saturationVariation,
                morphFactor
            );

            const minLightness = this.interpolateValue(
                this.mutedColors.honeycomb.minLightness,
                this.vibrantColors.honeycomb.minLightness,
                morphFactor
            );
            const maxLightness = this.interpolateValue(
                this.mutedColors.honeycomb.maxLightness,
                this.vibrantColors.honeycomb.maxLightness,
                morphFactor
            );
            const baseLightnessRaw = this.interpolateValue(
                this.mutedColors.honeycomb.baseLightness,
                this.vibrantColors.honeycomb.baseLightness,
                morphFactor
            ) + colorNoise * this.interpolateValue(
                this.mutedColors.honeycomb.lightnessVariation,
                this.vibrantColors.honeycomb.lightnessVariation,
                morphFactor
            ) + randomLightnessOffset;

            const baseLightness = Math.max(
                minLightness,
                Math.min(maxLightness, baseLightnessRaw)
            );

            // Calculate edge factor
            const distanceFromEdge = Math.min(
                baseCentroid[0],
                baseCentroid[1],
                this.width - baseCentroid[0],
                this.height - baseCentroid[1]
            );
            const edgeFactor = Math.min(1, distanceFromEdge / this.edgeThreshold);

            // Get interpolated target color (use pre-calculated HSL values)
            const targetHsl = {
                hue: this.interpolateValue(this.mutedTargetHsl.hue, this.vibrantTargetHsl.hue, morphFactor),
                saturation: this.interpolateValue(this.mutedTargetHsl.saturation, this.vibrantTargetHsl.saturation, morphFactor),
                lightness: this.interpolateValue(this.mutedTargetHsl.lightness, this.vibrantTargetHsl.lightness, morphFactor),
            };

            const totalDarknessFactor = this.calculateBlendFactor(baseLightness, edgeFactor);
            const innerColor = this.blendTowardsTargetHsl(
                baseHue,
                baseSaturation,
                baseLightness,
                totalDarknessFactor,
                targetHsl
            );

            const outerBlendFactor = Math.min(
                1,
                totalDarknessFactor + this.interpolateValue(
                    this.mutedColors.animation.outerBlendOffset,
                    this.vibrantColors.animation.outerBlendOffset,
                    morphFactor
                )
            );
            const outerColor = this.blendTowardsTargetHsl(
                baseHue,
                baseSaturation,
                baseLightness,
                outerBlendFactor,
                targetHsl
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
            };
        });
    }

    private interpolateValue(from: number, to: number, factor: number): number {
        return from + (to - from) * factor;
    }


    private calculateBlendFactor(baseLightness: number, edgeFactor: number): number {
        const darknessFactor = 1 - baseLightness / 80;
        const edgeDarknessFactor = 1 - (0.5 + 0.5 * edgeFactor);
        return Math.min(1, darknessFactor + edgeDarknessFactor);
    }

    private blendTowardsTargetHsl(
        baseHue: number,
        baseSaturation: number,
        baseLightness: number,
        blendFactor: number,
        targetHsl: { hue: number; saturation: number; lightness: number }
    ): { hue: number; saturation: number; lightness: number } {
        return {
            hue: baseHue + (targetHsl.hue - baseHue) * blendFactor,
            saturation: baseSaturation + (targetHsl.saturation - baseSaturation) * blendFactor,
            lightness: baseLightness + (targetHsl.lightness - baseLightness) * blendFactor,
        };
    }

    updateMorphRadius(radius: number): void {
        this.morphRadius = radius;
    }
}