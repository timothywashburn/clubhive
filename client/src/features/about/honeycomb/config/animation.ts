import { PhysicsConfig, HoneycombConfig } from './types';
import { DEFAULT_COLORS } from './colors';

export const DEFAULT_PHYSICS: PhysicsConfig = {
    mouseForce: 0.2,
    mouseRadius: 600,
    springStrength: 0.002,
    damping: 0.8,
    cutoffDistance: 80,
    minDistance: 1,
};

export const DEFAULT_CONFIG: HoneycombConfig = {
    numPoints: 1000,
    noiseAmount: 0.3,
    showDebug: true,
    colors: DEFAULT_COLORS,
    physics: DEFAULT_PHYSICS,
};

export const GENERATION_CONFIG = {
    margin: 0.2, // 20% margin on all sides
    edgeThresholdRatio: 0.1, // 10% of screen size
    noiseScale: 800, // Scale for noise calculation
};