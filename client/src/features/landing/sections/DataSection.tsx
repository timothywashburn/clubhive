import React from 'react';
import { motion } from 'framer-motion';
import { useLandingStatistics } from '../../../hooks/useLandingStatistics';

interface FeaturesSectionProps {
    isActive: boolean;
}

export function DataSection({ isActive }: FeaturesSectionProps) {
    const { data: statistics, loading } = useLandingStatistics();

    const title = 'Join Our Community';
    const subtitle = '(Right now only @ UC San Diego)';

    // Helper function to format numbers and handle singular/plural
    const formatStat = (count: number, singular: string, plural: string) => {
        const formattedNumber = count.toLocaleString();
        const label = count === 1 ? singular : plural;
        return { number: formattedNumber, label };
    };

    const stats = statistics
        ? [
              formatStat(statistics.clubs, 'Club', 'Clubs'),
              formatStat(statistics.users, 'User', 'Users'),
              formatStat(statistics.events, 'Event', 'Events'),
              formatStat(statistics.schools, 'School', 'Schools'),
          ]
        : [
              { number: '...', label: 'Clubs' },
              { number: '...', label: 'Students Connected' },
              { number: '...', label: 'Events Hosted' },
              { number: '...', label: 'Schools' },
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
                    className="text-4xl font-bold text-on-background mb-6"
                    initial={false}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {title}
                </motion.h2>
                <motion.p
                    className="text-xl text-on-background-variant"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {subtitle}
                </motion.p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-4 gap-8"
                initial={false}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {stats.map((stat, index) => {
                    const directions = [
                        { initial: { x: -60, opacity: 0 } },
                        { initial: { y: -60, opacity: 0 } },
                        { initial: { y: 60, opacity: 0 } },
                        { initial: { x: 60, opacity: 0 } },
                    ];

                    return (
                        <motion.div
                            key={index}
                            className="text-center"
                            initial={false}
                            animate={isActive ? { x: 0, y: 0, opacity: 1 } : directions[index]?.initial || { opacity: 0.7, y: 60 }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                        >
                            <motion.div
                                className="text-4xl font-bold text-primary mb-2"
                                initial={false}
                                animate={isActive ? { scale: 1 } : { scale: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                            >
                                {stat.number}
                            </motion.div>
                            <div className="text-on-background-variant">{stat.label}</div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
