// Main components
export { HoneycombTest } from '../../features/about/HoneycombTest.tsx';
export { StaticHoneycomb } from './components/StaticHoneycomb.tsx';
export { DynamicHoneycombComponent } from './components/DynamicHoneycomb.tsx';
export { GlowingHoneycomb } from './components/GlowingHoneycomb.tsx';

// Core classes
export { HoneycombBase } from './core/HoneycombBase.ts';
export { PointGenerator } from './core/PointGenerator.ts';
export { ColorCalculator } from './core/ColorCalculator.ts';
export { GlowingColorCalculator } from './core/GlowingColorCalculator.ts';
export { PhysicsEngine } from './core/PhysicsEngine.ts';
export { HoneycombRenderer } from './core/HoneycombRenderer.ts';

// Hooks
export { useCanvasSetup } from './hooks/useCanvasSetup.ts';
export { useMouseTracking } from './hooks/useMouseTracking.ts';
export { useAnimation } from './hooks/useAnimation.ts';

// Configuration
export { DEFAULT_COLORS, MUTED_COLORS, VIBRANT_COLORS } from './config/colors.ts';
export { DEFAULT_PHYSICS, DEFAULT_CONFIG, GENERATION_CONFIG } from './config/animation.ts';
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
} from './config/types.ts';

// Utility functions
export { hexToHsl } from './config/utils.ts';
