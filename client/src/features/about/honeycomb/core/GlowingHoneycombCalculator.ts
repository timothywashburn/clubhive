import { createNoise2D } from 'simplex-noise';
import { ColorData, VoronoiColors, Point } from '../config/types';
import { GENERATION_CONFIG } from '../config/animation';
import { hexToHsl, hexToRgb, rgbToHsl, alphaBlendRgb } from '../config/utils';

interface GlowState {
    isGlowing: boolean;
    glowIntensity: number; // 0 to 1
    activationTimer: number;
    lastActivationCheck: number;
}

export class GlowingHoneycombCalculator {
    private mutedColors: VoronoiColors;
    private vibrantColors: VoronoiColors;
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
    private activationChance: number; // Chance per frame to activate when cursor is near
    private glowSpeed: number; // How fast cells glow up
    private fadeSpeed: number; // How fast cells fade back

    constructor(
        mutedColors: VoronoiColors,
        vibrantColors: VoronoiColors,
        width: number,
        height: number,
        glowRadius: number = 300,
        activationChance: number = 0.05,
        glowSpeed: number = 0.02,
        fadeSpeed: number = 0.01
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
                isGlowing: false,
                glowIntensity: 0,
                activationTimer: 0,
                lastActivationCheck: 0,
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

            // Activation logic - random chance to start glowing when cursor is near
            if (isNearMouse && !glowState.isGlowing) {
                // Only check for activation every 100ms to avoid too frequent checks
                if (currentTime - glowState.lastActivationCheck > 100) {
                    glowState.lastActivationCheck = currentTime;

                    // Distance-based activation chance (closer = higher chance)
                    const distanceFactor =
                        1 - distanceFromMouse / this.glowRadius;
                    const adjustedChance = Math.min(
                        1.0,
                        this.activationChance * Math.pow(distanceFactor, 1.5)
                    );

                    if (Math.random() < adjustedChance) {
                        glowState.isGlowing = true;
                        glowState.activationTimer = currentTime;
                    }
                }
            }

            // Update glow intensity
            if (glowState.isGlowing && isNearMouse) {
                // Glow up while cursor is near
                const previousIntensity = glowState.glowIntensity;
                glowState.glowIntensity = Math.min(
                    1,
                    glowState.glowIntensity + this.glowSpeed
                );
            } else if (glowState.glowIntensity > 0) {
                // Fade out when cursor moves away or glow is done
                const previousIntensity = glowState.glowIntensity;
                glowState.glowIntensity = Math.max(
                    0,
                    glowState.glowIntensity - this.fadeSpeed
                );

                // Stop glowing when fully faded
                if (glowState.glowIntensity <= 0) {
                    glowState.isGlowing = false;
                }
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
