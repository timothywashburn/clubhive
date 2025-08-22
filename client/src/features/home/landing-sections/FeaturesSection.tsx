import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Target } from 'lucide-react';

interface FeaturesSectionProps {
    isActive: boolean;
}

export function FeaturesSection({ isActive }: FeaturesSectionProps) {
    const title = 'Key Features';
    const subtitle = 'Get started exploring clubs, searching for events, or by creating an account to manage your own club!';
    const features = [
        { icon: Users, title: 'Explore Clubs', description: 'Connect with like-minded students' },
        { icon: Calendar, title: 'Discover Events', description: 'Never miss exciting activities' },
        { icon: Target, title: 'Create an Account', description: 'Streamline operations' },
    ];
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
                    {subtitle}
                </motion.p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-3 gap-8"
                initial={false}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={`feature-${index}`}
                        className="text-center p-8 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg border border-outline-variant hover:shadow-xl transition-all duration-300 hover:scale-105"
                        initial={false}
                        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                        transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: 'easeOut' }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <feature.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-on-surface mb-4">{feature.title}</h3>
                        <p className="text-on-surface-variant">{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
