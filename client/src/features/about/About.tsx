import React, { useState } from 'react';
import { Code, Users, Star } from 'lucide-react';
import { VoronoiHoneycomb } from './VoronoiHoneycomb.tsx';
import { DevPanel } from './DevPanel.tsx';

export function About() {
    const [regularity, setRegularity] = useState(0);
    const [noiseAmount, setNoiseAmount] = useState(0.15);
    const [showDebug, setShowDebug] = useState(false);

    const contributors = [
        { name: 'alex chen', commits: 87, role: 'project manager' },
        { name: 'jordan smith', commits: 124, role: 'frontend wizard' },
        { name: 'taylor kim', commits: 156, role: 'backend guru' },
        { name: 'casey brown', commits: 98, role: 'full-stack explorer' },
        { name: 'morgan davis', commits: 73, role: 'database whisperer' },
        { name: 'riley jones', commits: 91, role: 'ui/ux enthusiast' },
        { name: 'jamie wilson', commits: 67, role: 'bug hunter' },
    ];

    const maxCommits = Math.max(...contributors.map(c => c.commits));

    return (
        <div className="min-h-screen relative">
            <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <VoronoiHoneycomb
                    numPoints={8000}
                    relaxationSteps={regularity}
                    noiseAmount={noiseAmount}
                    showDebug={showDebug}
                />
            </div>

            <DevPanel
                regularity={regularity}
                onRegularityChange={setRegularity}
                noiseAmount={noiseAmount}
                onNoiseAmountChange={setNoiseAmount}
                showDebug={showDebug}
                onShowDebugChange={setShowDebug}
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-20 bg-black/20 backdrop-blur-md rounded-2xl p-8">
                    <h1 className="text-5xl md:text-7xl font-black text-on-surface mb-6">
                        hey there! 👋
                    </h1>
                    <p className="text-xl md:text-2xl text-on-surface-variant max-w-4xl mx-auto leading-relaxed">
                        welcome to{' '}
                        <span className="font-bold text-primary">clubhive</span>{' '}
                        - Lorem ipsum dolor sit amet, consectetur adipiscing
                        elit. Sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                    </p>
                </div>

                {/* Project Story */}
                <div className="mb-20 max-w-4xl mx-auto bg-black/20 backdrop-blur-md rounded-2xl p-8">
                    <h2 className="text-4xl font-bold text-on-surface mb-8 text-center">
                        the project
                    </h2>
                    <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </p>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate
                            velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit
                            voluptatem accusantium doloremque laudantium, totam
                            rem aperiam, eaque ipsa quae ab illo inventore
                            veritatis et quasi architecto beatae vitae dicta
                            sunt.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20 bg-black/20 backdrop-blur-md rounded-2xl p-8">
                    <h2 className="text-4xl font-bold text-on-surface text-center mb-4">
                        our team
                    </h2>
                    <p className="text-lg text-on-surface-variant text-center mb-12">
                        SDSC RDS Internship Summer 2025
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                        {/* Project Manager */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <Users className="text-primary" size={28} />
                            </div>
                            <h3 className="text-sm font-bold text-on-surface">
                                project manager
                            </h3>
                        </div>

                        {/* Developers */}
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} className="text-center">
                                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                                    <Code className="text-primary" size={28} />
                                </div>
                                <h3 className="text-sm font-bold text-on-surface">
                                    dev #{i + 1}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contributors Section */}
                <div className="mb-20 bg-black/20 backdrop-blur-md rounded-2xl p-8">
                    <h2 className="text-4xl font-bold text-on-surface text-center mb-4">
                        contributors
                    </h2>
                    <p className="text-lg text-on-surface-variant text-center mb-12">
                        Welcome to the hive! Our contributors work together like
                        busy bees.
                    </p>

                    <div className="relative h-96 bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 p-8 flex items-center justify-center">
                            <p className="text-white/80 text-lg text-center">
                                put some text here
                            </p>
                        </div>
                    </div>
                </div>

                {/* Casual CTA */}
                <div className="text-center bg-black/20 backdrop-blur-md rounded-2xl p-8">
                    <h2 className="text-4xl font-bold text-on-surface mb-6">
                        ready to explore?
                    </h2>
                    <p className="text-xl text-on-surface-variant mb-10">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-primary text-on-primary px-8 py-4 rounded-md hover:bg-primary/90 font-medium text-lg transition-colors">
                            browse clubs
                        </button>
                        <button className="border border-primary text-primary px-8 py-4 rounded-md hover:bg-primary/10 font-medium text-lg transition-colors">
                            create a club
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
