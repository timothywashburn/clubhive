import React from 'react';
import { Code, Users, Star } from 'lucide-react';

export function About() {
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
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Hero Section */}
                <div className="text-center mb-20">
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
                <div className="mb-20 max-w-4xl mx-auto">
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
                <div className="mb-20">
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
                <div className="mb-20">
                    <h2 className="text-4xl font-bold text-on-surface text-center mb-4">
                        contributors
                    </h2>
                    <p className="text-lg text-on-surface-variant text-center mb-12">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    </p>

                    <div className="relative h-96 bg-surface rounded-2xl border border-divider overflow-hidden">
                        <div className="absolute inset-0 p-8">
                            {contributors.map((contributor, index) => {
                                const size =
                                    40 +
                                    (contributor.commits / maxCommits) * 80; // 40px to 120px
                                const positions = [
                                    { top: '20%', left: '15%' },
                                    { top: '60%', left: '25%' },
                                    { top: '30%', left: '45%' },
                                    { top: '70%', left: '55%' },
                                    { top: '15%', left: '70%' },
                                    { top: '50%', left: '80%' },
                                    { top: '80%', left: '10%' },
                                ];

                                return (
                                    <div
                                        key={contributor.name}
                                        className="absolute group cursor-pointer transition-all duration-300 hover:scale-110"
                                        style={{
                                            top: positions[index].top,
                                            left: positions[index].left,
                                            width: `${size}px`,
                                            height: `${size}px`,
                                        }}
                                    >
                                        <div className="w-full h-full bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30 hover:border-primary transition-colors">
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-primary truncate px-1">
                                                    {
                                                        contributor.name.split(
                                                            ' '
                                                        )[0]
                                                    }
                                                </div>
                                                <div className="text-xs text-primary/70">
                                                    {contributor.commits}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-surface border border-divider rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            <div className="text-sm font-bold text-on-surface">
                                                {contributor.name}
                                            </div>
                                            <div className="text-xs text-on-surface-variant">
                                                {contributor.role}
                                            </div>
                                            <div className="text-xs text-primary">
                                                {contributor.commits} commits
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Casual CTA */}
                <div className="text-center">
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
