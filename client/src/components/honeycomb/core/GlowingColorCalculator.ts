import { createNoise2D } from 'simplex-noise';
import { ColorData, HoneycombColors, HSLColor, Point } from '../config/types.ts';
import { GENERATION_CONFIG } from '../config/animation.ts';
import { hexToHsl, hexToRgb, rgbToHsl, alphaBlendRgb, calculateBlendFactor } from '../config/utils.ts';
import { useThemeStore } from '../../../stores/themeStore.ts';

// Constants for random intensity boost amounts
const MIN_INTENSITY_CHANGE = 0.1;
const MAX_INTENSITY_CHANGE = 0.4;
const RANDOM_CHECK_INTERVAL = 100;

// Constants for fade delay
const MIN_FADE_DELAY = 1_500;
const MAX_FADE_DELAY = 3_000;

interface GlowState {
    maxIntensity: number;
    glowIntensity: number;
    lastRandomCheck: number;
    fadeTimestamp: number;
}

export class GlowingColorCalculator {
    private mutedColors: HoneycombColors;
    private vibrantColors: HoneycombColors;
    private noise2D: ReturnType<typeof createNoise2D>;
    private glowRadius: number;
    private mutedTargetHsl: HSLColor;
    private vibrantTargetHsl: HSLColor;
    private glowStates: GlowState[] = [];
    private activationChance: number;
    private glowSpeed: number;
    private fadeSpeed: number;

    constructor(
        mutedColors: HoneycombColors,
        vibrantColors: HoneycombColors,
        glowRadius: number,
        activationChance: number,
        glowSpeed: number,
        fadeSpeed: number
    ) {
        this.mutedColors = mutedColors;
        this.vibrantColors = vibrantColors;
        this.noise2D = createNoise2D();
        this.glowRadius = glowRadius;
        this.activationChance = activationChance;
        this.glowSpeed = glowSpeed;
        this.fadeSpeed = fadeSpeed;

        // Pre-calculate target HSL and RGB values to avoid repeated conversions
        this.mutedTargetHsl = hexToHsl(mutedColors.honeycomb.blendTargetColor);
        this.vibrantTargetHsl = hexToHsl(vibrantColors.honeycomb.blendTargetColor);
    }

    initializeGlowStates(pointCount: number): void {
        this.glowStates = Array(pointCount)
            .fill(null)
            .map(() => ({
                maxIntensity: 0,
                glowIntensity: 0,
                lastRandomCheck: 0,
                fadeTimestamp: 0,
                lastMouseNearTime: 0,
                fadeDelay: 0,
            }));
    }

    calculateDynamicColorData(points: [number, number][], mousePosition: Point, staticRandomOffsets: number[]): ColorData[] {
        const currentTime = Date.now();

        return points.map((point, i) => {
            const baseCentroid = point;
            const colorNoise = this.noise2D(baseCentroid[0] / GENERATION_CONFIG.noiseScale, baseCentroid[1] / GENERATION_CONFIG.noiseScale);
            const randomLightnessOffset = staticRandomOffsets[i];
            const glowState = this.glowStates[i];

            const dx = mousePosition.x - baseCentroid[0];
            const dy = mousePosition.y - baseCentroid[1];
            const distanceFromMouse = Math.sqrt(dx * dx + dy * dy);
            const isNearMouse = distanceFromMouse < this.glowRadius;

            // Random logic - check for both activation and decay
            if (currentTime - glowState.lastRandomCheck > RANDOM_CHECK_INTERVAL) {
                glowState.lastRandomCheck = currentTime;

                // Activation logic - random chance to boost max intensity when cursor is near
                if (isNearMouse && glowState.maxIntensity < 1.0) {
                    const distanceFactor = 1 - distanceFromMouse / this.glowRadius;
                    const adjustedChance = this.activationChance * Math.pow(distanceFactor, 3);

                    if (Math.random() < adjustedChance) {
                        const intensityBoost = MIN_INTENSITY_CHANGE + Math.random() * (MAX_INTENSITY_CHANGE - MIN_INTENSITY_CHANGE);

                        if (glowState.glowIntensity >= glowState.maxIntensity) {
                            glowState.maxIntensity = Math.min(1.0, glowState.glowIntensity + intensityBoost);
                        } else {
                            glowState.maxIntensity = Math.min(1.0, glowState.maxIntensity + intensityBoost);
                        }
                    }
                }
            }

            if (isNearMouse) glowState.fadeTimestamp = currentTime + MIN_FADE_DELAY + Math.random() * (MAX_FADE_DELAY - MIN_FADE_DELAY);
            const shouldStartFading = currentTime - glowState.fadeTimestamp > 0;

            // Update glow intensity
            if (shouldStartFading) {
                glowState.maxIntensity = 0;
                glowState.glowIntensity = Math.max(0, glowState.glowIntensity - this.fadeSpeed);
            } else if (glowState.glowIntensity < glowState.maxIntensity) {
                glowState.glowIntensity = Math.min(glowState.maxIntensity, glowState.glowIntensity + this.glowSpeed);
            }

            // Calculate muted (base) colors first
            const mutedBaseHue = this.mutedColors.honeycomb.baseHue + colorNoise * this.mutedColors.honeycomb.hueVariation;
            const mutedBaseSaturation =
                this.mutedColors.honeycomb.baseSaturation + colorNoise * this.mutedColors.honeycomb.saturationVariation;
            const mutedBaseLightness = Math.max(
                0,
                Math.min(
                    100,
                    this.mutedColors.honeycomb.baseLightness +
                        colorNoise * this.mutedColors.honeycomb.lightnessVariation +
                        randomLightnessOffset
                )
            );

            // Calculate vibrant colors
            const vibrantBaseHue = this.vibrantColors.honeycomb.baseHue + colorNoise * this.vibrantColors.honeycomb.hueVariation;
            const vibrantBaseSaturation =
                this.vibrantColors.honeycomb.baseSaturation + colorNoise * this.vibrantColors.honeycomb.saturationVariation;
            const vibrantBaseLightness = Math.max(
                0,
                Math.min(
                    100,
                    this.vibrantColors.honeycomb.baseLightness +
                        colorNoise * this.vibrantColors.honeycomb.lightnessVariation +
                        randomLightnessOffset
                )
            );

            const theme = useThemeStore.getState().theme;

            const mutedDarknessFactor = calculateBlendFactor(theme, mutedBaseLightness);
            const mutedInnerColor = this.blendTowardsTargetHsl(
                mutedBaseHue,
                mutedBaseSaturation,
                mutedBaseLightness,
                mutedDarknessFactor,
                this.mutedTargetHsl
            );

            const mutedOuterBlendFactor = Math.min(1, mutedDarknessFactor + this.mutedColors.animation.outerBlendOffset);
            const mutedOuterColor = this.blendTowardsTargetHsl(
                mutedBaseHue,
                mutedBaseSaturation,
                mutedBaseLightness,
                mutedOuterBlendFactor,
                this.mutedTargetHsl
            );

            if (theme === 'light') {
                mutedInnerColor.lightness = Math.min(mutedInnerColor.lightness, this.mutedColors.honeycomb.baseLightness);
                mutedOuterColor.lightness = Math.min(mutedOuterColor.lightness, this.mutedColors.honeycomb.baseLightness);
            }

            const vibrantDarknessFactor = calculateBlendFactor('vibrant', vibrantBaseLightness);
            const vibrantInnerColor = this.blendTowardsTargetHsl(
                vibrantBaseHue,
                vibrantBaseSaturation,
                vibrantBaseLightness,
                vibrantDarknessFactor,
                this.vibrantTargetHsl
            );

            const vibrantOuterBlendFactor = Math.min(1, vibrantDarknessFactor + this.vibrantColors.animation.outerBlendOffset);
            const vibrantOuterColor = this.blendTowardsTargetHsl(
                vibrantBaseHue,
                vibrantBaseSaturation,
                vibrantBaseLightness,
                vibrantOuterBlendFactor,
                this.vibrantTargetHsl
            );

            // TODO: fix the atrocity
            if (theme === 'light') {
                vibrantInnerColor.lightness = Math.min(vibrantInnerColor.lightness, 70);
                vibrantOuterColor.lightness = Math.min(vibrantOuterColor.lightness, 80);
            }

            // Alpha blend muted (background) and vibrant (foreground) colors using glow intensity
            const alpha = glowState.glowIntensity;

            // Convert HSL to RGB for alpha blending
            const mutedInnerRgb = this.hslToRgb(mutedInnerColor.hue, mutedInnerColor.saturation, mutedInnerColor.lightness);
            const mutedOuterRgb = this.hslToRgb(mutedOuterColor.hue, mutedOuterColor.saturation, mutedOuterColor.lightness);
            const vibrantInnerRgb = this.hslToRgb(vibrantInnerColor.hue, vibrantInnerColor.saturation, vibrantInnerColor.lightness);
            const vibrantOuterRgb = this.hslToRgb(vibrantOuterColor.hue, vibrantOuterColor.saturation, vibrantOuterColor.lightness);

            // Alpha blend inner and outer colors
            const blendedInnerRgb = alphaBlendRgb(mutedInnerRgb, vibrantInnerRgb, alpha);
            const blendedOuterRgb = alphaBlendRgb(mutedOuterRgb, vibrantOuterRgb, alpha);

            // Alpha blend edge colors
            const mutedEdgeRgb = hexToRgb(this.mutedColors.honeycomb.edgeStroke);
            const vibrantEdgeRgb = hexToRgb(this.vibrantColors.honeycomb.edgeStroke);
            const blendedEdgeRgb = alphaBlendRgb(mutedEdgeRgb, vibrantEdgeRgb, alpha);

            // Convert back to HSL
            const innerColor = rgbToHsl(blendedInnerRgb.r, blendedInnerRgb.g, blendedInnerRgb.b);
            const outerColor = rgbToHsl(blendedOuterRgb.r, blendedOuterRgb.g, blendedOuterRgb.b);
            const edgeColor = rgbToHsl(blendedEdgeRgb.r, blendedEdgeRgb.g, blendedEdgeRgb.b);

            const innerColorString = `hsl(${innerColor.hue}, ${innerColor.saturation}%, ${innerColor.lightness}%)`;
            const outerColorString = `hsl(${outerColor.hue}, ${outerColor.saturation}%, ${outerColor.lightness}%)`;
            const edgeColorString = `hsl(${edgeColor.hue}, ${edgeColor.saturation}%, ${edgeColor.lightness}%)`;

            return {
                baseHue: mutedBaseHue,
                baseSaturation: mutedBaseSaturation,
                baseLightness: mutedBaseLightness,
                colorNoise,
                randomLightnessOffset,
                innerColor,
                outerColor,
                innerColorString,
                outerColorString,
                edgeColorString,
            };
        });
    }

    private blendTowardsTargetHsl(
        baseHue: number,
        baseSaturation: number,
        baseLightness: number,
        blendFactor: number,
        targetHsl: HSLColor
    ): HSLColor {
        return {
            hue: baseHue + (targetHsl.hue - baseHue) * blendFactor,
            saturation: baseSaturation + (targetHsl.saturation - baseSaturation) * blendFactor,
            lightness: baseLightness + (targetHsl.lightness - baseLightness) * blendFactor,
        };
    }

    updateGlowRadius(radius: number): void {
        this.glowRadius = radius;
    }

    updateGlowSettings(activationChance: number, glowSpeed: number, fadeSpeed: number): void {
        this.activationChance = activationChance;
        this.glowSpeed = glowSpeed;
        this.fadeSpeed = fadeSpeed;
    }

    getGlowIntensities(): number[] {
        return this.glowStates.map(state => state.glowIntensity);
    }

    private hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p: number, q: number, t: number): number => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    }
}
