export interface HoneycombCellColors {
    baseHue: number;
    hueVariation: number;
    baseSaturation: number;
    saturationVariation: number;
    baseLightness: number;
    lightnessVariation: number;
    minLightness: number;
    maxLightness: number;
    randomLightnessRange: number;
    blendTargetColor: string; // Hex color that honeycomb blends towards
    edgeStroke: string; // Hex color for the edge stroke
}

export interface HoneycombDebugColors {
    currentPoint: string;
    basePoint: string;
    connectionLine: string;
    connectionLineOpacity: number;
    mousePosition: string;
    mouseRadius: string;
    mouseRadiusOpacity: number;
}

export interface HoneycombAnimationSettings {
    strokeWidth: number;
    innerHexagonScale: number;
    outerBlendOffset: number;
}

export interface HoneycombColors {
    honeycomb: HoneycombCellColors;
    debug: HoneycombDebugColors;
    animation: HoneycombAnimationSettings;
}

export interface PhysicsConfig {
    mouseForce: number;
    mouseRadius: number;
    springStrength: number;
    damping: number;
    cutoffDistance: number;
    minDistance: number;
}

export interface HoneycombConfig {
    numPoints: number;
    noiseAmount: number;
    showDebug: boolean;
    colors: HoneycombColors;
    physics: PhysicsConfig;
}

export interface Point {
    x: number;
    y: number;
}

export interface Velocity {
    vx: number;
    vy: number;
}

export interface HSLColor {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface ColorData {
    baseHue: number;
    baseSaturation: number;
    baseLightness: number;
    colorNoise: number;
    randomLightnessOffset: number;
    innerColor: {
        hue: number;
        saturation: number;
        lightness: number;
    };
    outerColor: {
        hue: number;
        saturation: number;
        lightness: number;
    };
    innerColorString: string;
    outerColorString: string;
    edgeColorString: string;
}

export interface HoneycombProps {
    className?: string;
    numPoints: number;
    noiseAmount: number;
    showDebug: boolean;
    isStatic?: boolean;
}
