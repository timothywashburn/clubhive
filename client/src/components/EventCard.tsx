import React, { useState } from 'react';
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck } from 'lucide-react';
import { EventData } from '@clubhive/shared';
import { eventService } from '../services/eventService';
import { ClubLogo } from './ClubLogo';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

interface EventCardProps {
    event: EventData;
    clubName?: string;
    clubUrl?: string;
    isSaved?: boolean;
    onSaveToggle?: (eventId: string, isSaved: boolean) => void;
    showSaveButton?: boolean;
}

export function EventCard({ event, clubName, clubUrl, isSaved = false, onSaveToggle, showSaveButton = true }: EventCardProps) {
    const [isToggling, setIsToggling] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const handleSaveToggle = async () => {
        if (isToggling || !onSaveToggle) return;

        setIsToggling(true);
        try {
            const newSavedState = !isSaved;
            await eventService.toggleSaveEvent(event._id, newSavedState);
            onSaveToggle(event._id, newSavedState);
        } catch (error) {
            console.error('Error toggling event save:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const handleCardClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget || !(e.target as Element).closest('button')) {
            navigate(`/events/${event._id}`);
        }
    };

    const handleClubNameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (clubUrl) {
            navigate(`/club-profile/${clubUrl}`);
        }
    };

    return (
        <motion.div
            className="bg-surface border border-outline-variant rounded-lg p-4 cursor-pointer"
            onClick={handleCardClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <ClubLogo clubLogo={event.clubLogo} clubName={clubName} size="sm" className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-medium text-on-surface line-clamp-1">{event.name}</h3>
                            {clubName && (
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-on-surface-variant font-normal opacity-75">•</span>
                                    <span
                                        className="text-xs text-on-surface-variant font-normal opacity-75 hover:text-primary hover:underline cursor-pointer"
                                        onClick={clubUrl ? handleClubNameClick : undefined}
                                    >
                                        {clubName}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {showSaveButton && onSaveToggle && (
                    <button
                        onClick={handleSaveToggle}
                        disabled={isToggling}
                        className={`ml-3 p-1 rounded-md transition-colors flex-shrink-0 cursor-pointer hover:bg-surface-variant ${
                            isSaved ? 'text-primary hover:text-primary' : 'text-on-surface-variant hover:text-on-surface'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                )}
            </div>

            {event.description && <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{event.description}</p>}

            <div className="flex items-center justify-between text-sm text-on-surface-variant">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                        {formatDate(event.date)} at {formatTime(event.startTime)}
                    </span>
                </div>
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                </div>
                <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="text-xs">{event.type}</span>
                </div>
            </div>
        </motion.div>
    );
}
