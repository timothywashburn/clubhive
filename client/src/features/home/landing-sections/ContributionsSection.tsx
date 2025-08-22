import React from 'react';
import { motion } from 'framer-motion';
import { Github, Heart, Code, Users } from 'lucide-react';

interface ContributionsSectionProps {
    isActive: boolean;
}

export function ContributionsSection({ isActive }: ContributionsSectionProps) {
    const contributions = [
        { icon: Code, title: 'Code', description: 'Contribute features, fixes, and improvements' },
        { icon: Github, title: 'Issues', description: 'Report bugs and suggest enhancements' },
        { icon: Users, title: 'Community', description: 'Help other users and share ideas' },
        { icon: Heart, title: 'Support', description: 'Star the repo and spread the word' },
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
                    Open Source & Community
                </motion.h2>
                <motion.p
                    className="text-xl text-on-surface-variant max-w-3xl mx-auto"
                    initial={false}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Clubhive is built by students, for students. Join our growing community of contributors and help shape the future of
                    campus life.
                </motion.p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
                initial={false}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {contributions.map((contribution, index) => (
                    <motion.div
                        key={`contribution-${index}`}
                        className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl shadow-lg border border-outline-variant hover:shadow-xl transition-all duration-300 hover:scale-105"
                        initial={false}
                        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                        transition={{ duration: 0.6, delay: index * 0.15 + 0.2, ease: 'easeOut' }}
                    >
                        <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <contribution.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-on-surface mb-2">{contribution.title}</h3>
                        <p className="text-sm text-on-surface-variant">{contribution.description}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="text-center"
                initial={false}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 30 }}
                transition={{ duration: 0.6, delay: 0.8 }}
            >
                <motion.a
                    href="https://github.com/your-org/clubhive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-background border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-on-primary transition-all duration-300 hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Github className="w-5 h-5" />
                    View on GitHub
                </motion.a>
            </motion.div>
        </div>
    );
}
