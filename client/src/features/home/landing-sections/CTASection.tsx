import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
    isActive: boolean;
    navigate: (path: string) => void;
}

export function CTASection({ isActive, navigate }: CTASectionProps) {
    const title = 'Ready to Start?';
    const content = 'Join thousands of students who are already making the most of their college years with clubhive.';
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" style={{ opacity: isActive ? 1 : 0.7 }}>
            <motion.div
                initial={false}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.9 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.h2
                    className="text-4xl font-bold text-on-background mb-6"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-xl text-on-background-variant mb-8"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {content}
                </motion.p>
                <motion.button
                    onClick={() => navigate('/signup')}
                    className="bg-primary text-on-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all duration-300 cursor-pointer inline-flex items-center group hover:scale-105 shadow-lg hover:shadow-xl"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.7, y: 20, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 200 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </motion.div>
        </div>
    );
}
