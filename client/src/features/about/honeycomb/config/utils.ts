/**
 * Converts hex color to HSL values
 * @param hex - Hex color string (e.g., '#512205')
 * @returns HSL object with hue, saturation, and lightness values
 */
export function hexToHsl(hex: string): { hue: number; saturation: number; lightness: number } {
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