import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, UserPlus } from 'lucide-react';

interface FeaturesSectionProps {
    isActive: boolean;
    navigate: (path: string) => void;
}

export function FeaturesSection({ isActive, navigate }: FeaturesSectionProps) {
    const title = 'Features';
    const subtitle = 'Get started exploring clubs, searching for events, or by creating an account to manage your own club!';

    const features = [
        {
            icon: Users,
            title: 'Browse Clubs',
            route: '/clubs',
        },
        {
            icon: Calendar,
            title: 'View Events',
            route: '/events',
        },
        {
            icon: UserPlus,
            title: 'Sign Up',
            route: '/signup',
        },
    ];
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20" style={{ opacity: isActive ? 1 : 0.7 }}>
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
                        onClick={() => navigate(feature.route)}
                        className="group text-center p-4 bg-background/60 hover:bg-background/80 rounded-xl border border-outline-variant/50 hover:border-primary/60 transition-all duration-300 hover:scale-102 flex flex-col items-center justify-center cursor-pointer min-h-[140px]"
                        initial={false}
                        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                        transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: 'easeOut' }}
                    >
                        <feature.icon className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                            {feature.title}
                        </h3>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
