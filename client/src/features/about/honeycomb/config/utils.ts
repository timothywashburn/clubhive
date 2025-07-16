/**
 * Converts hex color to HSL values
 * @param hex - Hex color string (e.g., '#512205')
 * @returns HSL object with hue, saturation, and lightness values
 */
export function hexToHsl(hex: string): {
    hue: number;
    saturation: number;
    lightness: number;
} {
    // Remove the hash if present
    const cleanHex = hex.replace('#', '');

    // Parse the hex values
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate lightness
    const lightness = (max + min) / 2;

    // Calculate saturation
    let saturation = 0;
    if (delta !== 0) {
        saturation =
            lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
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
export function rgbToHsl(
    r: number,
    g: number,
    b: number
): { hue: number; saturation: number; lightness: number } {
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
        saturation =
            lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
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
