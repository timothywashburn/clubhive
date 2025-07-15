import React from 'react';
import { DynamicVoronoiHoneycombComponent } from './honeycomb/components/DynamicVoronoiHoneycomb';
import { StaticVoronoiHoneycomb } from './honeycomb/components/StaticVoronoiHoneycomb';
import { ColorMorphingHoneycomb } from './honeycomb/components/ColorMorphingHoneycomb';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    noiseAmount?: number;
    showDebug?: boolean;
    isStatic?: boolean;
    colorMorphing?: boolean;
    morphRadius?: number;
}

export function VoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    noiseAmount = 0.3,
    showDebug = false,
    isStatic = true,
    colorMorphing = true,
    morphRadius = 300,
}: VoronoiHoneycombProps) {
    if (colorMorphing) {
        return (
            <ColorMorphingHoneycomb
                className={className}
                numPoints={numPoints}
                noiseAmount={noiseAmount}
                showDebug={showDebug}
                morphRadius={morphRadius}
            />
        );
    }

    if (isStatic) {
        return (
            <StaticVoronoiHoneycomb
                className={className}
                numPoints={numPoints}
                noiseAmount={noiseAmount}
                showDebug={showDebug}
            />
        );
    }

    return (
        <DynamicVoronoiHoneycombComponent
            className={className}
            numPoints={numPoints}
            noiseAmount={noiseAmount}
            showDebug={showDebug}
        />
    );
}
