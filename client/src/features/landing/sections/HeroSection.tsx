import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    isActive: boolean;
    navigate: (path: string) => void;
}

export function HeroSection({ isActive, navigate }: HeroSectionProps) {
    return (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                className="text-center"
                initial={false}
                animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.7, y: 60, scale: 0.8 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.div
                    className="mb-8"
                    initial={false}
                    animate={isActive ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0.7, scale: 0.6, y: -40 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    <div className="h-50 mx-auto rounded-2xl flex items-center justify-center p-2">
                        <img src="/bee.svg" alt="Clubhive Bee Icon" className="w-full h-full object-contain" />
                    </div>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-7xl font-bold text-on-background mb-6 flex items-center justify-center gap-4"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.7, y: 60, scale: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                    <span>welcome to</span>
                    <img src="/logo_dark.svg" alt="Clubhive Logo" className="h-16 md:h-20 w-auto" />
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-on-background-variant mb-12 max-w-xl mx-auto"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 40 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                >
                    A tool for exploring clubs, finding events, and organizing your own club's affairs.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.7, y: 40, scale: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                >
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center group"
                    >
                        Get Started
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/signin')}
                        className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                    >
                        Sign In
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}
