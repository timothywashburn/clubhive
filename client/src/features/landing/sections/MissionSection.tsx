import React from 'react';
import { motion } from 'framer-motion';

interface MissionSectionProps {
    isActive: boolean;
}

export function MissionSection({ isActive }: MissionSectionProps) {
    const title = 'Our Mission';
    const content = "I swear I'll write this at some point";
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ opacity: isActive ? 1 : 0.7 }}>
            <motion.div
                className="text-center mb-16"
                initial={false}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 60 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.h2
                    className="text-4xl font-bold text-on-surface mb-6"
                    initial={false}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-xl text-on-surface-variant max-w-3xl mx-auto"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {content}
                </motion.p>
            </motion.div>
        </div>
    );
}
