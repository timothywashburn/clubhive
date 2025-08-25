import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import { StaticHoneycomb } from '../../components/honeycomb';
import {
    HeroSection,
    TextSection,
    FeaturesSection,
    StatsSection,
    TestimonialsSection,
    ContributionsSection,
    CTASection,
} from './landing-sections';

export function LandingPage() {
    const navigate = useNavigate();
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [nextAction, setNextAction] = useState<'next' | 'prev' | null>(null);
    const [lastScrollTime, setLastScrollTime] = useState(0);

    // Section types for navigation and rendering
    const sectionTypes = ['hero', 'text', 'features', 'stats', 'testimonials', 'contributions', 'cta'];
    const totalPositions = sectionTypes.length;
    const hexagonRadius = 1500;

    // Set hasMounted to true after component mounts to trigger hero animations
    useEffect(() => {
        const timer = setTimeout(() => setHasMounted(true), 100);
        return () => clearTimeout(timer);
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
        // Center (CTA now replaces overview)
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

    const getHoneycombPosition = () => {
        const parallaxIntensity = -0.1;
        const currentHexPos = hexagonPositions[currentPosition] || { x: 0, y: 0 };

        return {
            x: currentHexPos.x * parallaxIntensity,
            y: currentHexPos.y * parallaxIntensity,
        };
    };

    const honeycombPos = getHoneycombPosition();

    return (
        <div className="h-full relative">
            {/* Landing Page Honeycomb Background */}
            <div
                className="fixed"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100vh',
                    width: '100vw',
                    transform: 'translate(0vw, 0vh)',
                    zIndex: -1,
                }}
            >
                <StaticHoneycomb
                    x={honeycombPos.x}
                    y={honeycombPos.y}
                    scale={currentPosition + 1 == totalPositions ? 1 : 1.7}
                    numPoints={10000}
                />
            </div>

            {/* Navigation Progress Dots */}
            <div className="fixed top-20 right-8 z-50 flex flex-col gap-2">
                {sectionTypes.map((_, index) => (
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
                {sectionTypes.map((sectionType, index) => {
                    const position = hexagonPositions[index];
                    return (
                        <ContentSection
                            key={sectionType}
                            sectionType={sectionType}
                            position={position}
                            isActive={currentPosition === index && hasMounted}
                            isCTA={currentPosition === totalPositions - 1}
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
    sectionType: string;
    position: { x: number; y: number; scale: number };
    isActive: boolean;
    isCTA: boolean;
    navigate: (path: string) => void;
}

function ContentSection({ sectionType, position, isActive, isCTA, navigate }: ContentSectionProps) {
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

    const renderContent = () => {
        switch (sectionType) {
            case 'hero':
                return <HeroSection isActive={isActive} navigate={navigate} />;

            case 'text':
                return <TextSection isActive={isActive} />;

            case 'features':
                return <FeaturesSection isActive={isActive} />;

            case 'stats':
                return <StatsSection isActive={isActive} />;

            case 'testimonials':
                return <TestimonialsSection isActive={isActive} />;

            case 'contributions':
                return <ContributionsSection isActive={isActive} />;

            case 'cta':
                return <CTASection isActive={isActive} navigate={navigate} />;

            default:
                return null;
        }
    };

    return <div style={baseStyle}>{renderContent()}</div>;
}
