import { useCallback, useMemo } from 'react';
import { HoneycombColors } from '../config/types.ts';
import { cssVariableToHsl, getCSSVariable } from '../config/utils.ts';
import { VIBRANT_COLORS } from '../config/colors.ts';
import { useThemeStore } from '../../../stores/themeStore.ts';

interface HoneycombColorPair {
    baseColors: HoneycombColors;
    vibrantColors: HoneycombColors;
}

export function useHoneycombColors(): HoneycombColorPair {
    const { theme } = useThemeStore();

    const getThemedValue = useCallback(
        <T>(ifLight: T, ifDark: T): T => {
            if (theme === 'light') {
                return ifLight;
            } else if (theme === 'dark') {
                return ifDark;
            }
            throw new Error(`Unknown theme: ${theme}`);
        },
        [theme]
    );

    return useMemo(() => {
        const backgroundHsl = cssVariableToHsl('--color-background');
        const backgroundHex = getCSSVariable('--color-background');

        // Create base colors from theme
        const baseColors: HoneycombColors = {
            honeycomb: {
                baseHue: backgroundHsl?.hue,
                hueVariation: 15,
                baseSaturation: backgroundHsl?.saturation,
                saturationVariation: 20,
                baseLightness: backgroundHsl?.lightness,
                lightnessVariation: 15,
                randomLightnessRange: 15,
                blendTargetColor: backgroundHex,
                edgeStroke: backgroundHex,
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

        return { baseColors, vibrantColors: VIBRANT_COLORS };
    }, [theme]);
}
