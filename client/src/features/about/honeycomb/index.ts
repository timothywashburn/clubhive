// Main components
export { VoronoiHoneycomb } from '../VoronoiHoneycomb';
export { StaticVoronoiHoneycomb } from './components/StaticVoronoiHoneycomb';
export { DynamicVoronoiHoneycombComponent } from './components/DynamicVoronoiHoneycomb';

// Core classes
export { VoronoiHoneycombBase } from './core/VoronoiHoneycombBase';
export { PointGenerator } from './core/PointGenerator';
export { ColorCalculator } from './core/ColorCalculator';
export { PhysicsEngine } from './core/PhysicsEngine';
export { HoneycombRenderer } from './core/HoneycombRenderer';

// Hooks
export { useCanvasSetup } from './hooks/useCanvasSetup';
export { useMouseTracking } from './hooks/useMouseTracking';
export { useAnimation } from './hooks/useAnimation';

// Configuration
export { DEFAULT_COLORS } from './config/colors';
export { DEFAULT_PHYSICS, DEFAULT_CONFIG, GENERATION_CONFIG } from './config/animation';
export type {
    VoronoiHoneycombProps,
    HoneycombConfig,
    VoronoiColors,
    HoneycombColors,
    DebugColors,
    AnimationSettings,
    PhysicsConfig,
    Point,
    Velocity,
    ColorData,
} from './config/types';

// Utility functions
export { hexToHsl } from './config/utils';