import { createNoise2D } from 'simplex-noise';
import { ColorData, HoneycombColors, Point } from '../config/types';
import { GENERATION_CONFIG } from '../config/animation';
import { hexToHsl, hexToRgb, rgbToHsl, alphaBlendRgb } from '../config/utils';

// Constants for random intensity boost amounts
const MIN_INTENSITY_CHANGE = 0.1;
const MAX_INTENSITY_CHANGE = 0.4;
const RANDOM_CHECK_INTERVAL = 100; // Check for activation/decay every 100ms

interface GlowState {
    maxIntensity: number; // 0 to 1 - maximum intensity this cell can reach
    glowIntensity: number; // 0 to 1 - current intensity
    activationTimer: number;
    lastRandomCheck: number;
}

export class GlowingHoneycombCalculator {
    private mutedColors: HoneycombColors;
    private vibrantColors: HoneycombColors;
    private width: number;
    private height: number;
    private noise2D: ReturnType<typeof createNoise2D>;
    private edgeThreshold: number;
    private glowRadius: number;
    private mutedTargetHsl: {
        hue: number;
        saturation: number;
        lightness: number;
    };
    private vibrantTargetHsl: {
        hue: number;
        saturation: number;
        lightness: number;
    };
    private mutedTargetRgb: { r: number; g: number; b: number };
    private vibrantTargetRgb: { r: number; g: number; b: number };
    private glowStates: GlowState[] = [];
    private activationChance: number; // Chance per check to activate when cursor is near
    private decayChance: number; // Chance per check to decay intensity
    private glowSpeed: number; // How fast cells glow up
    private fadeSpeed: number; // How fast cells fade back

    constructor(
        mutedColors: HoneycombColors,
        vibrantColors: HoneycombColors,
        width: number,
        height: number,
        glowRadius: number,
        activationChance: number,
        glowSpeed: number,
        fadeSpeed: number,
        decayChance: number
    ) {
        this.mutedColors = mutedColors;
        this.vibrantColors = vibrantColors;
        this.width = width;
        this.height = height;
        this.noise2D = createNoise2D();
        this.edgeThreshold =
            Math.min(width, height) * GENERATION_CONFIG.edgeThresholdRatio;
        this.glowRadius = glowRadius;
        this.activationChance = activationChance;
        this.decayChance = decayChance;
        this.glowSpeed = glowSpeed;
        this.fadeSpeed = fadeSpeed;

        // Pre-calculate target HSL and RGB values to avoid repeated conversions
        this.mutedTargetHsl = hexToHsl(mutedColors.honeycomb.blendTargetColor);
        this.vibrantTargetHsl = hexToHsl(
            vibrantColors.honeycomb.blendTargetColor
        );
        this.mutedTargetRgb = hexToRgb(mutedColors.honeycomb.blendTargetColor);
        this.vibrantTargetRgb = hexToRgb(
            vibrantColors.honeycomb.blendTargetColor
        );
    }

    initializeGlowStates(pointCount: number): void {
        this.glowStates = Array(pointCount)
            .fill(null)
            .map(() => ({
                maxIntensity: 0,
                glowIntensity: 0,
                activationTimer: 0,
                lastRandomCheck: 0,
            }));
    }

    calculateDynamicColorData(
        points: [number, number][],
        mousePosition: Point,
        staticRandomOffsets: number[]
    ): ColorData[] {
        const currentTime = Date.now();

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
            const isNearMouse =
                mousePosition.x > -500 && distanceFromMouse < this.glowRadius;

            // Update glow state for this cell
            const glowState = this.glowStates[i];

            // Random logic - check for both activation and decay
            if (
                currentTime - glowState.lastRandomCheck >
                RANDOM_CHECK_INTERVAL
            ) {
                glowState.lastRandomCheck = currentTime;

                // Activation logic - random chance to boost max intensity when cursor is near
                if (isNearMouse && glowState.maxIntensity < 1.0) {
                    // Distance-based activation chance (closer = higher chance)
                    const distanceFactor =
                        1 - distanceFromMouse / this.glowRadius;
                    const adjustedChance = Math.min(
                        1.0,
                        this.activationChance * Math.pow(distanceFactor, 2)
                    );

                    if (Math.random() < adjustedChance) {
                        // Add random boost to max intensity
                        const intensityBoost =
                            MIN_INTENSITY_CHANGE +
                            Math.random() *
                                (MAX_INTENSITY_CHANGE - MIN_INTENSITY_CHANGE);

                        // If cell is at max intensity (fading), boost from current instead of previous max
                        if (glowState.glowIntensity >= glowState.maxIntensity) {
                            glowState.maxIntensity = Math.min(
                                1.0,
                                glowState.glowIntensity + intensityBoost
                            );
                        } else {
                            glowState.maxIntensity = Math.min(
                                1.0,
                                glowState.maxIntensity + intensityBoost
                            );
                        }

                        glowState.activationTimer = currentTime;
                    }
                }

                // Decay logic - random chance to reduce max intensity over time
                if (glowState.maxIntensity > 0) {
                    if (Math.random() < this.decayChance) {
                        // Reduce max intensity by random decay amount
                        const intensityDecay =
                            MIN_INTENSITY_CHANGE +
                            Math.random() *
                                (MAX_INTENSITY_CHANGE - MIN_INTENSITY_CHANGE);
                        glowState.maxIntensity = Math.max(
                            0,
                            glowState.maxIntensity - intensityDecay
                        );
                    }
                }
            }

            // Update glow intensity based on max intensity threshold
            if (
                glowState.glowIntensity < glowState.maxIntensity &&
                isNearMouse
            ) {
                // Glow up towards max intensity when cursor is near
                glowState.glowIntensity = Math.min(
                    glowState.maxIntensity,
                    glowState.glowIntensity + this.glowSpeed
                );
            } else if (glowState.glowIntensity >= glowState.maxIntensity) {
                glowState.maxIntensity = 0;
                // Fade down when at or above max intensity
                glowState.glowIntensity = Math.max(
                    0,
                    glowState.glowIntensity - this.fadeSpeed
                );
            }

            // Reset max intensity when fully faded to 0
            if (glowState.glowIntensity <= 0) {
                glowState.maxIntensity = 0;
            }

            // Calculate muted (base) colors first
            const mutedBaseHue =
                this.mutedColors.honeycomb.baseHue +
                colorNoise * this.mutedColors.honeycomb.hueVariation;
            const mutedBaseSaturation =
                this.mutedColors.honeycomb.baseSaturation +
                colorNoise * this.mutedColors.honeycomb.saturationVariation;
            const mutedBaseLightnessRaw =
                this.mutedColors.honeycomb.baseLightness +
                colorNoise * this.mutedColors.honeycomb.lightnessVariation +
                randomLightnessOffset;
            const mutedBaseLightness = Math.max(
                this.mutedColors.honeycomb.minLightness,
                Math.min(
                    this.mutedColors.honeycomb.maxLightness,
                    mutedBaseLightnessRaw
                )
            );

            // Calculate vibrant colors
            const vibrantBaseHue =
                this.vibrantColors.honeycomb.baseHue +
                colorNoise * this.vibrantColors.honeycomb.hueVariation;
            const vibrantBaseSaturation =
                this.vibrantColors.honeycomb.baseSaturation +
                colorNoise * this.vibrantColors.honeycomb.saturationVariation;
            const vibrantBaseLightnessRaw =
                this.vibrantColors.honeycomb.baseLightness +
                colorNoise * this.vibrantColors.honeycomb.lightnessVariation +
                randomLightnessOffset;
            const vibrantBaseLightness = Math.max(
                this.vibrantColors.honeycomb.minLightness,
                Math.min(
                    this.vibrantColors.honeycomb.maxLightness,
                    vibrantBaseLightnessRaw
                )
            );

            // Calculate edge factor
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

            // Calculate muted colors with edge blending
            const mutedDarknessFactor = this.calculateBlendFactor(
                mutedBaseLightness,
                edgeFactor
            );
            const mutedInnerColor = this.blendTowardsTargetHsl(
                mutedBaseHue,
                mutedBaseSaturation,
                mutedBaseLightness,
                mutedDarknessFactor,
                this.mutedTargetHsl
            );

            const mutedOuterBlendFactor = Math.min(
                1,
                mutedDarknessFactor +
                    this.mutedColors.animation.outerBlendOffset
            );
            const mutedOuterColor = this.blendTowardsTargetHsl(
                mutedBaseHue,
                mutedBaseSaturation,
                mutedBaseLightness,
                mutedOuterBlendFactor,
                this.mutedTargetHsl
            );

            // Calculate vibrant colors with edge blending
            const vibrantDarknessFactor = this.calculateBlendFactor(
                vibrantBaseLightness,
                edgeFactor
            );
            const vibrantInnerColor = this.blendTowardsTargetHsl(
                vibrantBaseHue,
                vibrantBaseSaturation,
                vibrantBaseLightness,
                vibrantDarknessFactor,
                this.vibrantTargetHsl
            );

            const vibrantOuterBlendFactor = Math.min(
                1,
                vibrantDarknessFactor +
                    this.vibrantColors.animation.outerBlendOffset
            );
            const vibrantOuterColor = this.blendTowardsTargetHsl(
                vibrantBaseHue,
                vibrantBaseSaturation,
                vibrantBaseLightness,
                vibrantOuterBlendFactor,
                this.vibrantTargetHsl
            );

            // Alpha blend muted (background) and vibrant (foreground) colors using glow intensity
            const alpha = glowState.glowIntensity;

            // Convert HSL to RGB for alpha blending
            const mutedInnerRgb = this.hslToRgb(
                mutedInnerColor.hue,
                mutedInnerColor.saturation,
                mutedInnerColor.lightness
            );
            const mutedOuterRgb = this.hslToRgb(
                mutedOuterColor.hue,
                mutedOuterColor.saturation,
                mutedOuterColor.lightness
            );
            const vibrantInnerRgb = this.hslToRgb(
                vibrantInnerColor.hue,
                vibrantInnerColor.saturation,
                vibrantInnerColor.lightness
            );
            const vibrantOuterRgb = this.hslToRgb(
                vibrantOuterColor.hue,
                vibrantOuterColor.saturation,
                vibrantOuterColor.lightness
            );

            // Alpha blend inner and outer colors
            const blendedInnerRgb = alphaBlendRgb(
                mutedInnerRgb,
                vibrantInnerRgb,
                alpha
            );
            const blendedOuterRgb = alphaBlendRgb(
                mutedOuterRgb,
                vibrantOuterRgb,
                alpha
            );

            // Alpha blend edge colors
            const mutedEdgeRgb = hexToRgb(
                this.mutedColors.honeycomb.edgeStroke
            );
            const vibrantEdgeRgb = hexToRgb(
                this.vibrantColors.honeycomb.edgeStroke
            );
            const blendedEdgeRgb = alphaBlendRgb(
                mutedEdgeRgb,
                vibrantEdgeRgb,
                alpha
            );

            // Convert back to HSL
            const innerColor = rgbToHsl(
                blendedInnerRgb.r,
                blendedInnerRgb.g,
                blendedInnerRgb.b
            );
            const outerColor = rgbToHsl(
                blendedOuterRgb.r,
                blendedOuterRgb.g,
                blendedOuterRgb.b
            );
            const edgeColor = rgbToHsl(
                blendedEdgeRgb.r,
                blendedEdgeRgb.g,
                blendedEdgeRgb.b
            );

            const innerColorString = `hsl(${innerColor.hue}, ${innerColor.saturation}%, ${innerColor.lightness}%)`;
            const outerColorString = `hsl(${outerColor.hue}, ${outerColor.saturation}%, ${outerColor.lightness}%)`;
            const edgeColorString = `hsl(${edgeColor.hue}, ${edgeColor.saturation}%, ${edgeColor.lightness}%)`;

            return {
                baseHue: mutedBaseHue,
                baseSaturation: mutedBaseSaturation,
                baseLightness: mutedBaseLightness,
                colorNoise,
                randomLightnessOffset,
                edgeFactor,
                innerColor,
                outerColor,
                innerColorString,
                outerColorString,
                edgeColorString,
            };
        });
    }

    private interpolateValue(from: number, to: number, factor: number): number {
        return from + (to - from) * factor;
    }

    private calculateBlendFactor(
        baseLightness: number,
        edgeFactor: number
    ): number {
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
            saturation:
                baseSaturation +
                (targetHsl.saturation - baseSaturation) * blendFactor,
            lightness:
                baseLightness +
                (targetHsl.lightness - baseLightness) * blendFactor,
        };
    }

    updateGlowRadius(radius: number): void {
        this.glowRadius = radius;
    }

    updateGlowSettings(
        activationChance: number,
        glowSpeed: number,
        fadeSpeed: number
    ): void {
        this.activationChance = activationChance;
        this.glowSpeed = glowSpeed;
        this.fadeSpeed = fadeSpeed;
    }

    private hslToRgb(
        h: number,
        s: number,
        l: number
    ): { r: number; g: number; b: number } {
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
