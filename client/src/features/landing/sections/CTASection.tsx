import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
    isActive: boolean;
    navigate: (path: string) => void;
}

export function CTASection({ isActive, navigate }: CTASectionProps) {
    const title = 'Ready to Start?';
    const content = 'I have no idea what to put here, should it be a redirect to the signup page?';
    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative z-10"
            style={{ transform: 'scale(50)', pointerEvents: isActive ? 'auto' : 'none' }}
        >
            {/* Top content - equal height to bottom */}
            <div className="flex-1 flex flex-col justify-end items-center pb-8 -mt-20">
                <motion.h2
                    className="text-4xl font-bold text-on-background text-center"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {title}
                </motion.h2>
            </div>

            {/* Bee logo in center */}
            <motion.div
                initial={false}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={isActive ? { duration: 0.8, ease: 'easeOut', delay: 0.4 } : { duration: 0.25, ease: 'easeOut', delay: 0 }}
            >
                <img src="/bee.svg" alt="Clubhive Bee" className="w-32 h-32" />
            </motion.div>

            {/* Bottom content - equal height to top */}
            <div className="flex-1 flex flex-col justify-start items-center pt-8">
                <motion.p
                    className="text-xl text-on-background-variant max-w-2xl text-center mb-8"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    {content}
                </motion.p>

                <motion.button
                    onClick={() => navigate('/signup')}
                    className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 cursor-pointer inline-flex items-center group hover:scale-105 shadow-lg hover:shadow-xl"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.7, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.8, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </div>
    );
}
