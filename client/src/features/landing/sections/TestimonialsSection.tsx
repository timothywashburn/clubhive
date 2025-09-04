import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface TestimonialsSectionProps {
    isActive: boolean;
}

export function TestimonialsSection({ isActive }: TestimonialsSectionProps) {
    const title = 'I still need to figure out something to put here';
    const subtitle = 'Maybe it would be fun to get real students to do testimonials lol';
    const testimonials = [
        { name: 'Sarah Chen', role: 'CS Club President', text: 'Clubhive has transformed how we manage our club.', avatar: 'SC' },
        { name: 'Marcus Johnson', role: 'Photography Member', text: 'My go-to platform for campus activities.', avatar: 'MJ' },
        { name: 'Emily Rodriguez', role: 'Drama Officer', text: '300% increase in attendance since using Clubhive.', avatar: 'ER' },
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
                    className="text-xl text-on-surface-variant"
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
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        className="bg-background p-8 rounded-xl shadow-sm border border-outline-variant"
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 60 }}
                        transition={{ duration: 0.8, delay: index * 0.15 + 0.2, ease: 'easeOut' }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center font-semibold mr-4">
                                {testimonial.avatar}
                            </div>
                            <div>
                                <div className="font-semibold text-on-surface">{testimonial.name}</div>
                                <div className="text-sm text-on-surface-variant">{testimonial.role}</div>
                            </div>
                        </div>
                        <p className="text-on-surface-variant italic">"{testimonial.text}"</p>
                        <div className="flex mt-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-primary fill-current" />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
