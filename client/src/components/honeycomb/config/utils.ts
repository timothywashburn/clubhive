import { HSLColor } from './types.ts';

/**
 * Converts hex color to HSL values
 * @param hex - Hex color string (e.g., '#512205')
 * @returns HSL object with hue, saturation, and lightness values
 */
export function hexToHsl(hex: string): HSLColor {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
}

/**
 * Converts hex color to RGB values (0-255)
 * @param hex - Hex color string (e.g., '#512205')
 * @returns RGB object with red, green, blue values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const cleanHex = hex.replace('#', '');
    return {
        r: parseInt(cleanHex.substring(0, 2), 16),
        g: parseInt(cleanHex.substring(2, 4), 16),
        b: parseInt(cleanHex.substring(4, 6), 16),
    };
}

/**
 * Converts RGB values to HSL
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL object with hue, saturation, and lightness values
 */
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate lightness
    const lightness = (max + min) / 2;

    // Calculate saturation
    let saturation = 0;
    if (delta !== 0) {
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    }

    // Calculate hue
    let hue = 0;
    if (delta !== 0) {
        switch (max) {
            case r:
                hue = (g - b) / delta + (g < b ? 6 : 0);
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
        }
        hue /= 6;
    }

    return {
        hue: Math.round(hue * 360),
        saturation: Math.round(saturation * 100),
        lightness: Math.round(lightness * 100),
    };
}

/**
 * Gets CSS variable value from document root
 * @param variable - CSS variable name (e.g., '--color-background')
 * @returns CSS variable value or null if not found
 */
export function getCSSVariable(variable: string): string | null {
    if (typeof document === 'undefined') return null;

    const styles = getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue(variable).trim();
    return value || null;
}

/**
 * Converts CSS variable to HSL color
 * @param variable - CSS variable name (e.g., '--color-background')
 * @returns HSL object or null if variable not found or invalid
 */
export function cssVariableToHsl(variable: string): HSLColor | null {
    const value = getCSSVariable(variable);
    if (!value) return null;

    // Handle hex colors
    if (value.startsWith('#')) {
        return hexToHsl(value);
    }

    // Handle rgb() colors
    if (value.startsWith('rgb(')) {
        const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            return rgbToHsl(r, g, b);
        }
    }

    // Handle rgba() colors
    if (value.startsWith('rgba(')) {
        const match = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
        if (match) {
            const r = parseInt(match[1]);
            const g = parseInt(match[2]);
            const b = parseInt(match[3]);
            return rgbToHsl(r, g, b);
        }
    }

    return null;
}

/**
 * Alpha blends two RGB colors
 * @param background - Background RGB color
 * @param foreground - Foreground RGB color
 * @param alpha - Alpha value (0-1) for foreground opacity
 * @returns Blended RGB color
 */
export function alphaBlendRgb(
    background: { r: number; g: number; b: number },
    foreground: { r: number; g: number; b: number },
    alpha: number
): { r: number; g: number; b: number } {
    const invAlpha = 1 - alpha;
    return {
        r: Math.round(foreground.r * alpha + background.r * invAlpha),
        g: Math.round(foreground.g * alpha + background.g * invAlpha),
        b: Math.round(foreground.b * alpha + background.b * invAlpha),
    };
}
