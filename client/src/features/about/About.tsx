import React, { useState, useEffect, useRef } from 'react';
import { Code, Users } from 'lucide-react';
import { GlowingHoneycomb } from '../../components/honeycomb';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

type HoneycombType = 'static' | 'dynamic' | 'glowing';

export function About() {
    const [noiseAmount, setNoiseAmount] = useState(0.15);
    const [showDebug, setShowDebug] = useState(false);
    const [honeycombType, setHoneycombType] = useState<HoneycombType>('glowing');
    const [scrollY, setScrollY] = useState(0);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuthStore();

    const navigate = useNavigate();

    const handleClickAccount = () => {
        if (isAuthenticated) {
            navigate('/account');
        } else {
            navigate('/signup');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            // Find the main scrollable container (App.tsx's main element)
            const mainElement = document.querySelector('main');
            if (mainElement) {
                setScrollY(mainElement.scrollTop);
            }
        };

        // Find the main scrollable container and add listener
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.addEventListener('scroll', handleScroll);
            return () => mainElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className="h-full relative">
            <div
                ref={backgroundRef}
                className="fixed"
                style={{
                    top: 0,
                    left: '0',
                    right: '0',
                    height: '150vh',
                    transform: `translateY(${scrollY * -0.05}px)`,
                    zIndex: -1,
                }}
            >
                <GlowingHoneycomb
                    numPoints={7000}
                    noiseAmount={0.25}
                    glowRadius={250}
                    activationChance={1.5}
                    decayChance={0.03}
                    glowSpeed={0.02}
                    fadeSpeed={0.01}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-1">
                {/* Hero Section */}
                <div className="text-center mb-20 bg-surface/80 backdrop-blur-[4px] rounded-lg shadow p-8 border border-outline-variant">
                    <h1 className="text-5xl md:text-7xl font-black text-on-surface mb-6">hey there! 👋</h1>
                    <p className="text-xl md:text-2xl text-on-surface-variant max-w-4xl mx-auto leading-relaxed">
                        welcome to <span className="font-bold text-primary">clubhive</span> - a centralized club system for students, made
                        by students.
                    </p>
                </div>

                {/* Project Story */}
                <div className="mb-20 max-w-4xl mx-auto bg-surface/80 backdrop-blur-[4px] rounded-lg shadow p-8 border border-outline-variant">
                    <h2 className="text-4xl font-bold text-on-surface mb-8 text-center">the project</h2>
                    <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat.
                        </p>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                            sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20 bg-surface/80 backdrop-blur-[4px] rounded-lg shadow p-8 border border-outline-variant">
                    <h2 className="text-4xl font-bold text-on-surface text-center mb-4">our team</h2>
                    <p className="text-lg text-on-surface-variant text-center mb-12">SDSC RDS Internship Summer 2025</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                        {/* Project Manager */}
                        <div className="text-center">
                            <img
                                src="/jayden.png"
                                alt="Jayden Wang"
                                className="w-50 h-auto mx-auto mb-3 flex items-center justify-center"
                            />
                            <h3 className="text-sm font-bold text-on-surface">Jayden Wang</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">project manager</h3>
                        </div>

                        {/* Product Owner */}
                        <div className="text-center">
                            <img
                                src="/timothy.png"
                                alt="Timothy Washburn"
                                className="w-50 h-auto mx-auto mb-3 flex items-center justify-center"
                            />
                            <h3 className="text-sm font-bold text-on-surface">Timothy Washburn</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">product owner</h3>
                        </div>

                        {/* Developers */}
                        <div className="text-center">
                            <img
                                src="/anisha.png"
                                alt="Anisha Ramesh"
                                className="w-50 h-auto mx-auto mb-3 flex items-center justify-center"
                            />
                            <h3 className="text-sm font-bold text-on-surface">Anisha Ramesh</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">developer</h3>
                        </div>

                        <div className="text-center">
                            <img
                                src="/anjali.png"
                                alt="Anjali Ravi"
                                className="w-50 h-auto mx-auto mb-3 flex items-center justify-center"
                            />
                            <h3 className="text-sm font-bold text-on-surface">Anjali Ravi</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">developer</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-6 flex items-center justify-center">
                        <div className="text-center">
                            <img
                                src="/keyura.png"
                                alt="Keyura Valalla"
                                className="w-50 h-auto mx-auto mb-3 flex items-center justify-center"
                            />
                            <h3 className="text-sm font-bold text-on-surface">Keyura Valalla</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">developer</h3>
                        </div>

                        <div className="text-center">
                            <img src="/minjoo.png" alt="Minjoo O" className="w-50 h-auto mx-auto mb-3 flex items-center justify-center" />
                            <h3 className="text-sm font-bold text-on-surface">Minjoo O</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">developer</h3>
                        </div>

                        <div className="text-center">
                            <img src="/ruth.png" alt="Ruth Liu" className="w-50 h-auto mx-auto mb-3 flex items-center justify-center" />
                            <h3 className="text-sm font-bold text-on-surface">Ruth Liu</h3>
                            <h3 className="text-sm font-bold text-on-surface-variant">developer</h3>
                        </div>
                    </div>
                </div>

                {/* Contributors Section */}
                <div className="mb-20 bg-surface/80 backdrop-blur-[4px] rounded-lg shadow p-8 border border-outline-variant">
                    <h2 className="text-4xl font-bold text-on-surface text-center mb-4">contributors</h2>
                    <p className="text-lg text-on-surface-variant text-center mb-12">
                        Welcome to the hive! Our contributors work together like busy bees.
                    </p>

                    <div className="relative h-96 bg-surface-variant rounded-lg overflow-hidden border border-outline-variant">
                        <div className="absolute inset-0 p-8 flex items-center justify-center">
                            <p className="text-on-surface-variant text-lg text-center">TBA</p>
                        </div>
                    </div>
                </div>

                {/* Casual CTA */}
                <div className="text-center bg-surface/80 backdrop-blur-[4px] rounded-lg shadow p-8 border border-outline-variant">
                    <h2 className="text-4xl font-bold text-on-surface mb-6">ready to explore?</h2>
                    {/*<p className="text-xl text-on-surface-variant mb-10">Blehhh</p>*/}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => navigate('/clubs')}
                            className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            browse clubs
                        </button>
                        <button
                            onClick={handleClickAccount}
                            className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                        >
                            create an account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
