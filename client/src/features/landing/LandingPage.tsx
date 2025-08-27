import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useBackgroundStore } from '../../stores/backgroundStore.ts';
import {
    HeroSection,
    MissionSection,
    FeaturesSection,
    DataSection,
    TestimonialsSection,
    ContributionsSection,
    CTASection,
} from './sections';

enum SectionType {
    HERO = 'hero',
    TEXT = 'text',
    FEATURES = 'features',
    DATA = 'stats',
    TESTIMONIALS = 'testimonials',
    CONTRIBUTIONS = 'contributions',
    CTA = 'cta',
}

export function LandingPage() {
    const navigate = useNavigate();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [nextAction, setNextAction] = useState<'next' | 'prev' | null>(null);
    const [lastScrollTime, setLastScrollTime] = useState(0);

    const totalPositions = Object.values(SectionType).length;
    const hexagonRadius = 1500;
    const progressWidth = `${(currentPosition / (totalPositions - 1)) * 100}%`;

    // Set hasMounted to true after component mounts to trigger hero animations
    useEffect(() => {
        const timer = setTimeout(() => setHasMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Reset scroll position to top when landing page loads
    useEffect(() => {
        const mainElement = document.querySelector('main');
        if (mainElement) mainElement.scrollTop = 0;
    }, []);

    const hexagonPositions = [
        // Top-left
        { x: -hexagonRadius * Math.cos(Math.PI / 6), y: -hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Bottom-left
        { x: -hexagonRadius * Math.cos(Math.PI / 6), y: hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Bottom
        { x: 0, y: hexagonRadius, scale: 1 },
        // Bottom-right
        { x: hexagonRadius * Math.cos(Math.PI / 6), y: hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Top-right
        { x: hexagonRadius * Math.cos(Math.PI / 6), y: -hexagonRadius * Math.sin(Math.PI / 6), scale: 1 },
        // Top
        { x: 0, y: -hexagonRadius, scale: 1 },
        // Center
        { x: 0, y: 0, scale: 0.02 },
    ];

    // Process next queued action when transition finishes
    useEffect(() => {
        if (nextAction && !isTransitioning) {
            const actionToProcess = nextAction;
            setNextAction(null);

            if (actionToProcess === 'next' && currentPosition < totalPositions - 1) {
                setIsTransitioning(true);
                setCurrentPosition(prev => prev + 1);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 700);
            } else if (actionToProcess === 'prev' && currentPosition > 0) {
                setIsTransitioning(true);
                setCurrentPosition(prev => prev - 1);
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 700);
            }
        }
    }, [nextAction, isTransitioning, currentPosition, totalPositions]);

    // Handle navigation between positions
    const handleNext = useCallback(() => {
        if (currentPosition >= totalPositions - 1) return;

        if (isTransitioning) {
            if (!nextAction && currentPosition + 1 < totalPositions - 1) {
                setNextAction('next');
            }
        } else {
            setIsTransitioning(true);
            setCurrentPosition(prev => prev + 1);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 700);
        }
    }, [currentPosition, totalPositions, isTransitioning, nextAction]);

    const handlePrev = useCallback(() => {
        if (currentPosition <= 0) return;

        if (isTransitioning) {
            if (!nextAction && currentPosition - 1 > 0) {
                setNextAction('prev');
            }
        } else {
            setIsTransitioning(true);
            setCurrentPosition(prev => prev - 1);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 700);
        }
    }, [currentPosition, isTransitioning, nextAction]);

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

    useEffect(() => {
        let lastProcessedTime = lastScrollTime;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();

            const now = Date.now();
            if (now - lastProcessedTime < 700) return;

            if (Math.abs(e.deltaY) > 10) {
                lastProcessedTime = now;
                setLastScrollTime(now);
                if (e.deltaY > 0) {
                    handleNext();
                } else {
                    handlePrev();
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleNext, handlePrev, lastScrollTime]);

    const currentTransform = hexagonPositions[currentPosition];
    const { setPosition } = useBackgroundStore();

    const getHoneycombPosition = () => {
        const parallaxIntensity = -0.1;
        const currentHexPos = hexagonPositions[currentPosition] || { x: 0, y: 0 };

        return {
            x: currentHexPos.x * parallaxIntensity,
            y: currentHexPos.y * parallaxIntensity,
        };
    };

    const honeycombPos = getHoneycombPosition();

    useEffect(() => {
        setPosition(honeycombPos.x, honeycombPos.y, currentPosition + 1 == totalPositions ? 1 : 1.7);
    }, [honeycombPos.x, honeycombPos.y, currentPosition, totalPositions, setPosition]);

    return (
        <div className="h-full relative">
            {/* Progress Bar */}
            <motion.div
                className="fixed top-16 left-0 h-0.5 bg-primary z-50"
                initial={{ width: '0%' }}
                animate={{ width: progressWidth }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 150,
                    duration: 0.6,
                }}
            />

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
                initial={{
                    x: -hexagonPositions[0].x,
                    y: -hexagonPositions[0].y,
                    scale: hexagonPositions[0].scale,
                }}
                animate={{
                    x: -currentTransform.x,
                    y: -currentTransform.y,
                    scale: currentTransform.scale,
                }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 150,
                    duration: 0.6,
                }}
            >
                {/* All content sections positioned at their hexagon coordinates */}
                {Object.values(SectionType).map((sectionType, index) => {
                    const position = hexagonPositions[index];
                    return (
                        <ContentSection
                            key={sectionType}
                            sectionType={sectionType}
                            position={position}
                            isActive={currentPosition === index && hasMounted}
                            navigate={navigate}
                        />
                    );
                })}
            </motion.div>
        </div>
    );
}

interface ContentSectionProps {
    sectionType: SectionType;
    position: { x: number; y: number; scale: number };
    isActive: boolean;
    navigate: (path: string) => void;
}

function ContentSection({ sectionType, position, isActive, navigate }: ContentSectionProps) {
    const baseStyle = {
        position: 'absolute' as const,
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: '100vw',
        height: 'calc(100vh - 4rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const renderContent = () => {
        switch (sectionType) {
            case SectionType.HERO:
                return <HeroSection isActive={isActive} navigate={navigate} />;
            case SectionType.TEXT:
                return <MissionSection isActive={isActive} />;
            case SectionType.FEATURES:
                return <FeaturesSection isActive={isActive} />;
            case SectionType.DATA:
                return <DataSection isActive={isActive} />;
            case SectionType.TESTIMONIALS:
                return <TestimonialsSection isActive={isActive} />;
            case SectionType.CONTRIBUTIONS:
                return <ContributionsSection isActive={isActive} />;
            case SectionType.CTA:
                return <CTASection isActive={isActive} navigate={navigate} />;
        }
    };

    return <div style={baseStyle}>{renderContent()}</div>;
}
