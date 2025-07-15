// Main components
export { Honeycomb } from '../Honeycomb.tsx';
export { StaticHoneycomb } from './components/StaticHoneycomb.tsx';
export { DynamicHoneycombComponent } from './components/DynamicHoneycomb.tsx';
export { GlowingHoneycomb } from './components/GlowingHoneycomb';

// Core classes
export { HoneycombBase } from './core/HoneycombBase.ts';
export { PointGenerator } from './core/PointGenerator';
export { ColorCalculator } from './core/ColorCalculator';
export { GlowingHoneycombCalculator } from './core/GlowingHoneycombCalculator';
export { PhysicsEngine } from './core/PhysicsEngine';
export { HoneycombRenderer } from './core/HoneycombRenderer';

// Hooks
export { useCanvasSetup } from './hooks/useCanvasSetup';
export { useMouseTracking } from './hooks/useMouseTracking';
export { useAnimation } from './hooks/useAnimation';

// Configuration
export { DEFAULT_COLORS, MUTED_COLORS, VIBRANT_COLORS } from './config/colors';
export {
    DEFAULT_PHYSICS,
    DEFAULT_CONFIG,
    GENERATION_CONFIG,
} from './config/animation';
export type {
    HoneycombProps,
    HoneycombConfig,
    HoneycombColors,
    HoneycombCellColors,
    HoneycombDebugColors,
    HoneycombAnimationSettings,
    PhysicsConfig,
    Point,
    Velocity,
    ColorData,
} from './config/types';

// Utility functions
export { hexToHsl } from './config/utils';
