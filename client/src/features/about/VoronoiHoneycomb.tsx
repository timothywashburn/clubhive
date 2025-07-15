import React from 'react';
import { DynamicVoronoiHoneycombComponent } from './honeycomb/components/DynamicVoronoiHoneycomb';
import { StaticVoronoiHoneycomb } from './honeycomb/components/StaticVoronoiHoneycomb';
import { GlowingHoneycomb } from './honeycomb/components/GlowingHoneycomb';

type HoneycombType = 'static' | 'dynamic' | 'glowing';

interface VoronoiHoneycombProps {
    className?: string;
    numPoints?: number;
    noiseAmount?: number;
    showDebug?: boolean;
    honeycombType?: HoneycombType;
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
    honeycombType = 'glowing',
    isStatic = true,
    glowing = true,
    glowRadius = 250,
    activationChance = 0.05,
    glowSpeed = 0.01,
    fadeSpeed = 0.002,
}: VoronoiHoneycombProps) {
    const type =
        honeycombType ||
        (glowing ? 'glowing' : isStatic ? 'static' : 'dynamic');

    console.log(type);

    if (type === 'glowing') {
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

    if (type === 'static') {
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
