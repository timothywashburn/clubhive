import React from 'react';
import { motion } from 'framer-motion';

interface OverviewSectionProps {
    isActive: boolean;
}

export function OverviewSection({ isActive }: OverviewSectionProps) {
    const title = 'Complete Platform';
    const content = 'Discover how all features work together to create the ultimate student organization platform.';
    return (
        <div className="text-center max-w-4xl mx-auto px-8" style={{ opacity: isActive ? 1 : 0.3 }}>
            <motion.div
                initial={false}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.h2
                    className="text-4xl md:text-6xl font-bold text-on-background mb-6"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-xl md:text-2xl text-on-background-variant mb-8"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {content}
                </motion.p>

                <motion.div
                    className="text-sm text-on-surface-variant"
                    initial={false}
                    animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    Navigate to any section using the dots on the right, or scroll to explore each feature.
                </motion.div>
            </motion.div>
        </div>
    );
}
