import React from 'react';
import { DynamicVoronoiHoneycombComponent } from './honeycomb/components/DynamicVoronoiHoneycomb';
import { StaticVoronoiHoneycomb } from './honeycomb/components/StaticVoronoiHoneycomb';
import { GlowingHoneycomb } from './honeycomb/components/GlowingHoneycomb';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    noiseAmount?: number;
    showDebug?: boolean;
    isStatic?: boolean;
    glowing?: boolean;
    glowRadius?: number;
    activationChance?: number;
    glowSpeed?: number;
    fadeSpeed?: number;
}

export function VoronoiHoneycomb({
    className = '',
    numPoints = 1000,
    noiseAmount = 0.3,
    showDebug = false,
    isStatic = true,
    glowing = true,
    glowRadius = 250,
    activationChance = 0.05,
    glowSpeed = 0.01,
    fadeSpeed = 0.002,
}: VoronoiHoneycombProps) {
    if (glowing) {
        return (
            <GlowingHoneycomb
                className={className}
                numPoints={numPoints}
                noiseAmount={noiseAmount}
                showDebug={showDebug}
                glowRadius={glowRadius}
                activationChance={activationChance}
                glowSpeed={glowSpeed}
                fadeSpeed={fadeSpeed}
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
