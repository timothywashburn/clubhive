import React from 'react';
import { DynamicHoneycombComponent } from './honeycomb/components/DynamicHoneycomb.tsx';
import { StaticHoneycomb } from './honeycomb/components/StaticHoneycomb.tsx';
import { GlowingHoneycomb } from './honeycomb/components/GlowingHoneycomb';
import { MUTED_COLORS, VIBRANT_COLORS } from './honeycomb/config/colors';

type HoneycombType = 'static' | 'dynamic' | 'glowing';

interface HoneycombProps {
    className?: string;
    numPoints?: number;
    noiseAmount?: number;
    showDebug?: boolean;
    honeycombType?: HoneycombType;
    isStatic?: boolean;
    glowing?: boolean;
    glowRadius?: number;
    activationChance?: number;
    decayChance?: number;
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
    activationChance = 1.5,
    decayChance = 0.03,
    glowSpeed = 0.02,
    fadeSpeed = 0.01,
}: HoneycombProps) {
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
                decayChance={decayChance}
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
