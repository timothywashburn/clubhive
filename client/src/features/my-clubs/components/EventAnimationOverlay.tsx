import { useEffect, useState } from 'react';
import { EventData } from '@clubhive/shared';

interface EventAnimationOverlayProps {
    eventElement: HTMLElement;
    eventData: EventData;
    targetSelector: string;
    sourceRect?: DOMRect;
}

export function EventAnimationOverlay({ eventElement, eventData, targetSelector, sourceRect: passedSourceRect }: EventAnimationOverlayProps) {
    const [animationState, setAnimationState] = useState<'start' | 'moving' | 'end'>('start');

    useEffect(() => {
        console.log('EventAnimationOverlay mounted', { eventElement, eventData, targetSelector });
        // Use the passed source rect if available, otherwise get it from the element
        const sourceRect = passedSourceRect || eventElement.getBoundingClientRect();
        console.log('Source rect:', sourceRect);
        
        // Get the target element (where the event name should end up)
        const targetElement = document.querySelector(targetSelector) as HTMLElement;
        if (!targetElement) {
            console.log('Target element not found:', targetSelector);
            return;
        }
        console.log('Target element found:', targetElement);
        
        const targetRect = targetElement.getBoundingClientRect();
        console.log('Target rect:', targetRect);

        // Create the animated element
        const animatedElement = document.createElement('div');
        animatedElement.textContent = eventData.name;
        animatedElement.className = 'bg-primary text-on-primary px-3 py-2 rounded-lg font-medium text-sm';
        animatedElement.style.position = 'fixed';
        animatedElement.style.left = `${sourceRect.left}px`;
        animatedElement.style.top = `${sourceRect.top}px`;
        animatedElement.style.width = `${sourceRect.width}px`;
        animatedElement.style.height = `${sourceRect.height}px`;
        animatedElement.style.zIndex = '1000';
        animatedElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animatedElement.style.transformOrigin = 'center';
        animatedElement.style.pointerEvents = 'none';
        animatedElement.style.display = 'flex';
        animatedElement.style.alignItems = 'center';
        animatedElement.style.justifyContent = 'center';
        animatedElement.style.whiteSpace = 'nowrap';
        animatedElement.style.overflow = 'hidden';
        animatedElement.style.textOverflow = 'ellipsis';
        
        // Make the original element invisible during animation
        eventElement.style.opacity = '0';
        
        document.body.appendChild(animatedElement);

        // Start the animation after a brief delay
        requestAnimationFrame(() => {
            setAnimationState('moving');
            
            // Calculate the translation to align the top-left corners
            const translateX = targetRect.left - sourceRect.left;
            const translateY = targetRect.top - sourceRect.top;
            
            // Apply the transformation - animate to target position while keeping button style
            animatedElement.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.0)`;
            animatedElement.style.width = 'auto';
            animatedElement.style.height = 'auto';
            animatedElement.style.opacity = '1';
        });

        // After animation completes, fade out the animated element and show the real title
        const fadeOut = () => {
            setAnimationState('end');
            animatedElement.style.opacity = '0';
            animatedElement.style.transition = 'opacity 0.3s ease-out';
            
            // Show the real title bar element
            const realTitleElement = document.querySelector('.club-header-event-target') as HTMLElement;
            if (realTitleElement) {
                realTitleElement.style.opacity = '1';
            }
            
            setTimeout(() => {
                if (animatedElement.parentNode) {
                    animatedElement.parentNode.removeChild(animatedElement);
                }
                eventElement.style.opacity = '';
            }, 300);
        };

        const timer = setTimeout(fadeOut, 800); // Wait a bit longer before fading out

        return () => {
            clearTimeout(timer);
            if (animatedElement.parentNode) {
                animatedElement.parentNode.removeChild(animatedElement);
            }
            eventElement.style.opacity = '';
        };
    }, [eventElement, targetSelector]);

    return null; // This component doesn't render anything visible itself
}