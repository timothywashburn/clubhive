import React from 'react';
import { DynamicVoronoiHoneycombComponent } from './honeycomb/components/DynamicVoronoiHoneycomb';
import { StaticVoronoiHoneycomb } from './honeycomb/components/StaticVoronoiHoneycomb';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    noiseAmount?: number;
    showDebug?: boolean;
    isStatic?: boolean;
}

export function VoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    noiseAmount = 0.3,
    showDebug = false,
    isStatic = true,
}: VoronoiHoneycombProps) {
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
