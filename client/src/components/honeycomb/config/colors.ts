import { HoneycombColors } from './types.ts';

export const VIBRANT_COLORS: HoneycombColors = {
    honeycomb: {
        baseHue: 40,
        hueVariation: 15,
        baseSaturation: 60,
        saturationVariation: 20,
        baseLightness: 50,
        lightnessVariation: 15,
        randomLightnessRange: 15,
        blendTargetColor: '#512205',
        edgeStroke: '#4d1f09',
    },

    debug: {
        currentPoint: '#ff0000',
        basePoint: '#0000ff',
        connectionLine: '#ffffff',
        connectionLineOpacity: 0.3,
        mousePosition: '#00ff00',
        mouseRadius: '#00ff00',
        mouseRadiusOpacity: 0.2,
    },

    animation: {
        strokeWidth: 3.5,
        innerHexagonScale: 0.7,
        outerBlendOffset: 0.4,
    },
};
