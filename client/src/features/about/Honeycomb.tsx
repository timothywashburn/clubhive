import React from 'react';
import { DynamicHoneycombComponent } from './honeycomb/components/DynamicHoneycomb.tsx';
import { StaticHoneycomb } from './honeycomb/components/StaticHoneycomb.tsx';
import { GlowingHoneycomb } from './honeycomb/components/GlowingHoneycomb';
import { MUTED_COLORS, VIBRANT_COLORS } from './honeycomb/config/colors';

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

export function Honeycomb({
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
                mutedColors={MUTED_COLORS}
                vibrantColors={VIBRANT_COLORS}
            />
        );
    }

    if (type === 'static') {
        return (
            <StaticHoneycomb
                className={className}
                numPoints={numPoints}
                noiseAmount={noiseAmount}
                showDebug={showDebug}
            />
        );
    }

    return (
        <DynamicHoneycombComponent
            className={className}
            numPoints={numPoints}
            noiseAmount={noiseAmount}
            showDebug={showDebug}
        />
    );
}
