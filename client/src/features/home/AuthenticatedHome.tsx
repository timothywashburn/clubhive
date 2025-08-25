import React, { useState, useEffect } from 'react';
import { CalendarHeart, Bookmark, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { EventData } from '@clubhive/shared';
import { eventService } from '../../services/eventService';
import { EventCard } from '../../components/EventCard';
import { EmptyEventState } from './components/EmptyEventState';
import { useAuthStore } from '../../stores/authStore';

export function AuthenticatedHome() {
    const navigate = useNavigate();
    const { isAuthenticated, isInitialized } = useAuthStore();
    const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([]);
    const [savedEvents, setSavedEvents] = useState<EventData[]>([]);
    const [savedEventIds, setSavedEventIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            navigate('/', { replace: true });
            return;
        }

        if (isAuthenticated) {
            fetchEvents();
        }
    }, [isAuthenticated, isInitialized, navigate]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await eventService.getMyEvents();
            setUpcomingEvents(data.upcomingEvents);
            setSavedEvents(data.savedEvents);
            setSavedEventIds(new Set(data.savedEvents.map(event => event._id)));
        } catch (err) {
            console.error('Error fetching events:', err);
            setError(err instanceof Error ? err.message : 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToggle = (eventId: string, isSaved: boolean) => {
        if (isSaved) {
            setSavedEventIds(prev => new Set([...prev, eventId]));
            const eventToAdd = upcomingEvents.find(event => event._id === eventId);
            if (eventToAdd) {
                setSavedEvents(prev => [...prev, eventToAdd]);
            }
        } else {
            setSavedEventIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(eventId);
                return newSet;
            });
            setSavedEvents(prev => prev.filter(event => event._id !== eventId));
        }
    };

    if (!isInitialized || loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-on-surface-variant">Loading your events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-error mb-4">{error}</p>
                    <button
                        onClick={fetchEvents}
                        className="bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-full relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                >
                    <h1 className="text-4xl font-bold text-on-surface mb-4">Welcome to clubhive</h1>
                    <p className="text-xl text-on-surface-variant mb-8">Discover, join, and manage your clubs all in one place</p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                >
                    {/* Upcoming Club Events */}
                    <div className="bg-surface rounded-lg shadow border border-outline-variant">
                        <div className="p-6 border-b border-outline-variant">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <h2 className="text-xl font-semibold text-on-surface">Upcoming Club Events</h2>
                                    <CalendarHeart className="text-primary w-6 h-6 ml-2" />
                                </div>
                                <button
                                    onClick={() => navigate('/events')}
                                    className="flex items-center bg-primary text-on-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Browse Events
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {upcomingEvents.length === 0 ? (
                                <EmptyEventState type="upcoming" />
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-surface">
                                    {upcomingEvents.map(event => (
                                        <EventCard
                                            key={event._id}
                                            event={event}
                                            clubName={event.clubName}
                                            isSaved={savedEventIds.has(event._id)}
                                            onSaveToggle={handleSaveToggle}
                                            showSaveButton={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Saved Events */}
                    <div className="bg-surface rounded-lg shadow border border-outline-variant">
                        <div className="p-6 border-b border-outline-variant">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <h2 className="text-xl font-semibold text-on-surface">Saved Events</h2>
                                    <Bookmark className="text-primary w-6 h-6 ml-2" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {savedEvents.length === 0 ? (
                                <EmptyEventState type="saved" />
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-surface">
                                    {savedEvents.map(event => (
                                        <EventCard
                                            key={event._id}
                                            event={event}
                                            clubName={event.clubName}
                                            isSaved={true}
                                            onSaveToggle={handleSaveToggle}
                                            showSaveButton={true}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
