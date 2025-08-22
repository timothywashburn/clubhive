import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Target, Star, ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';

export function LandingPage() {
    const navigate = useNavigate();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Total positions: 6 hexagon vertices + 1 overview = 7 positions
    const totalPositions = 7;

    // Hexagon vertex positions (6 vertices around a circle)
    const hexagonRadius = 1200; // Increased distance from center for more spread
    const hexagonPositions = [
        // Position 0: Top-left vertex (Hero) - Start position, not center
        { x: -hexagonRadius * Math.cos(Math.PI / 6), y: -hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Position 1: Top vertex (Mission)
        { x: 0, y: -hexagonRadius, scale: 1 },
        // Position 2: Top-right vertex (Features)
        { x: hexagonRadius * Math.cos(Math.PI / 6), y: -hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Position 3: Bottom-right vertex (Stats)
        { x: hexagonRadius * Math.cos(Math.PI / 6), y: hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Position 4: Bottom vertex (Testimonials)
        { x: 0, y: hexagonRadius, scale: 1 },
        // Position 5: Bottom-left vertex (CTA)
        { x: -hexagonRadius * Math.cos(Math.PI / 6), y: hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Position 6: Overview (zoom out to see all from center)
        { x: 0, y: 0, scale: 0.25 },
    ];

    // Handle navigation between positions
    const handleNext = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentPosition(prev => (prev + 1) % totalPositions);
        setTimeout(() => setIsTransitioning(false), 1000);
    }, [isTransitioning, totalPositions]);

    const handlePrev = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentPosition(prev => (prev - 1 + totalPositions) % totalPositions);
        setTimeout(() => setIsTransitioning(false), 1000);
    }, [isTransitioning, totalPositions]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                handleNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    // Mouse wheel navigation
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                handleNext();
            } else {
                handlePrev();
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleNext, handlePrev]);

    // Content sections positioned at hexagon vertices
    const contentSections = [
        // Position 0: Hero (Center)
        {
            id: 'hero',
            title: 'Welcome to clubhive',
            subtitle: 'The ultimate platform for student organizations',
            content: 'Discover clubs, manage events, and build lasting communities that matter.',
            type: 'hero',
        },
        // Position 1: Mission (Top vertex)
        {
            id: 'mission',
            title: 'Our Mission',
            subtitle: 'Empowering student organizations',
            content:
                'We believe that student organizations are the heart of campus life. Our mission is to empower every club and student with the tools they need to create meaningful connections.',
            type: 'text',
        },
        // Position 2: Features (Top-right vertex)
        {
            id: 'features',
            title: 'Key Features',
            subtitle: 'Everything you need',
            content: [
                { icon: Users, title: 'Join Communities', description: 'Connect with like-minded students' },
                { icon: Calendar, title: 'Discover Events', description: 'Never miss exciting activities' },
                { icon: Target, title: 'Manage Clubs', description: 'Streamline operations' },
            ],
            type: 'features',
        },
        // Position 3: Stats (Bottom-right vertex)
        {
            id: 'stats',
            title: 'Join the Movement',
            subtitle: 'Thousands of students trust clubhive',
            content: [
                { number: '500+', label: 'Active Clubs' },
                { number: '15K+', label: 'Students Connected' },
                { number: '2K+', label: 'Events Hosted' },
                { number: '50+', label: 'Universities' },
            ],
            type: 'stats',
        },
        // Position 4: Testimonials (Bottom vertex)
        {
            id: 'testimonials',
            title: 'What Students Say',
            subtitle: 'Real experiences from our community',
            content: [
                { name: 'Sarah Chen', role: 'CS Club President', text: 'Clubhive has transformed how we manage our club.', avatar: 'SC' },
                { name: 'Marcus Johnson', role: 'Photography Member', text: 'My go-to platform for campus activities.', avatar: 'MJ' },
                { name: 'Emily Rodriguez', role: 'Drama Officer', text: '300% increase in attendance since using Clubhive.', avatar: 'ER' },
            ],
            type: 'testimonials',
        },
        // Position 5: CTA (Bottom-left vertex)
        {
            id: 'cta',
            title: 'Ready to Start?',
            subtitle: 'Transform your campus experience',
            content: 'Join thousands of students who are already making the most of their college years with clubhive.',
            type: 'cta',
        },
        // Position 6: Overview (Zoom out)
        {
            id: 'overview',
            title: 'Complete Platform',
            subtitle: 'Everything connected',
            content: 'Discover how all features work together to create the ultimate student organization platform.',
            type: 'overview',
        },
    ];

    // Current viewport transform
    const currentTransform = hexagonPositions[currentPosition];

    return (
        <div className="fixed inset-0 overflow-hidden">
            {/* Navigation Progress Dots */}
            <div className="fixed top-20 right-8 z-50 flex flex-col gap-2">
                {contentSections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => !isTransitioning && setCurrentPosition(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentPosition ? 'bg-primary scale-125' : 'bg-on-surface/30 hover:bg-on-surface/50'
                        }`}
                        disabled={isTransitioning}
                    />
                ))}
            </div>

            {/* Navigation Hint */}
            {currentPosition < totalPositions - 1 && (
                <motion.div
                    className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-on-surface/60 flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <span className="text-sm">Scroll or press ↓ to continue</span>
                    <ChevronDown size={16} className="animate-bounce" />
                </motion.div>
            )}

            {/* Main Content Container */}
            <motion.div
                className="w-screen h-screen relative"
                animate={{
                    x: -currentTransform.x,
                    y: -currentTransform.y,
                    scale: currentTransform.scale,
                }}
                transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 90,
                    duration: 1,
                }}
            >
                {/* All content sections positioned at their hexagon coordinates */}
                {contentSections.map((section, index) => {
                    const position = hexagonPositions[index];
                    return (
                        <ContentSection
                            key={section.id}
                            section={section}
                            position={position}
                            isActive={currentPosition === index}
                            isOverview={currentPosition === totalPositions - 1}
                            navigate={navigate}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

// Content Section Component
interface ContentSectionProps {
    section: any;
    position: { x: number; y: number; scale: number };
    isActive: boolean;
    isOverview: boolean;
    navigate: (path: string) => void;
}

function ContentSection({ section, position, isActive, isOverview, navigate }: ContentSectionProps) {
    const baseStyle = {
        position: 'absolute' as const,
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Original animation variants from scroll-based version
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: 'easeOut' },
    };

    const slideInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: 'easeOut' },
    };

    const slideInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: 'easeOut' },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const scaleOnView = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: 'easeOut' },
    };

    const renderContent = () => {
        switch (section.type) {
            case 'hero':
                return (
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            className="text-center"
                            initial={false}
                            animate={isActive ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0.7, y: 40, scale: 0.95 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <motion.div
                                className="mb-8"
                                initial={false}
                                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.9 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <div className="w-24 h-24 mx-auto mb-6 bg-primary rounded-2xl flex items-center justify-center text-on-primary text-3xl font-bold shadow-lg">
                                    CH
                                </div>
                            </motion.div>

                            <motion.h1
                                className="text-5xl md:text-7xl font-bold text-on-background mb-6"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                Welcome to <span className="text-primary">clubhive</span>
                            </motion.h1>

                            <motion.p
                                className="text-xl md:text-2xl text-on-background-variant mb-12 max-w-3xl mx-auto"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                The ultimate platform for student organizations. Discover clubs, manage events, and build lasting
                                communities that matter.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
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

            case 'text':
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
                                {section.title}
                            </motion.h2>
                            <motion.p
                                className="text-xl text-on-surface-variant max-w-3xl mx-auto"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {section.content}
                            </motion.p>
                        </motion.div>
                    </div>
                );

            case 'features':
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
                                {section.title}
                            </motion.h2>
                            <motion.p
                                className="text-xl text-on-surface-variant max-w-3xl mx-auto"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {section.subtitle}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid md:grid-cols-3 gap-8"
                            initial={false}
                            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            {section.content.map((feature: any, index: number) => (
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

            case 'stats':
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
                                {section.title}
                            </motion.h2>
                            <motion.p
                                className="text-xl text-on-background-variant"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {section.subtitle}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid md:grid-cols-4 gap-8"
                            initial={false}
                            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            {section.content.map((stat: any, index: number) => {
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
                                        animate={
                                            isActive ? { x: 0, y: 0, opacity: 1 } : directions[index]?.initial || { opacity: 0.7, y: 60 }
                                        }
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

            case 'testimonials':
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
                                {section.title}
                            </motion.h2>
                            <motion.p
                                className="text-xl text-on-surface-variant"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {section.subtitle}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="grid md:grid-cols-3 gap-8"
                            initial={false}
                            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.7, scale: 0.8 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            {section.content.map((testimonial: any, index: number) => (
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

            case 'cta':
                return (
                    <div
                        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
                        style={{ opacity: isActive ? 1 : 0.7 }}
                    >
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
                                {section.title}
                            </motion.h2>
                            <motion.p
                                className="text-xl text-on-background-variant mb-8"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {section.content}
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

            case 'overview':
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
                                {section.title}
                            </motion.h2>
                            <motion.p
                                className="text-xl md:text-2xl text-on-background-variant mb-8"
                                initial={false}
                                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                {section.content}
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

            default:
                return null;
        }
    };

    return <div style={baseStyle}>{renderContent()}</div>;
}
