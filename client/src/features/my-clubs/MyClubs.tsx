import { motion, AnimatePresence } from 'framer-motion';
import { useClubState, useTabIndicator, useMyClubsData, useClubEvents } from './hooks';
import {
    ClubSelector,
    ClubHeader,
    TabNavigation,
    MemberInfo,
    OfficerInfo,
    Events,
    Stats,
    Membership,
    EmptyState,
    RegisterClubButton,
} from './components';
import { EventPlanner } from './event-planner';
import { EventDetails, LocationPicker, TAPIntegration, ASFunding, DangerZone } from './event-editor';
import { EventData, EventType } from '@clubhive/shared';
import { eventService } from '../../services/eventService';
import React, { useState } from 'react';

export function MyClubs() {
    const { clubs, loading, error } = useMyClubsData();

    const {
        selectedClub,
        setSelectedClub,
        activeTab,
        setActiveTab,
        setActiveTabDirect,
        isPreviewMode,
        setIsPreviewMode,
        isOfficer,
        isOwner,
        showOfficerView,
        returnToEvents,
    } = useClubState(clubs || []);

    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isClubSelectorMinimized, setIsClubSelectorMinimized] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [eventPlannerViewMode, setEventPlannerViewMode] = useState<'calendar' | 'agenda'>('calendar');

    const handleToggleMinimize = () => {
        setIsAnimating(true);
        setTimeout(
            () => {
                setIsClubSelectorMinimized(!isClubSelectorMinimized);
                setTimeout(() => setIsAnimating(false), 300);
            },
            isClubSelectorMinimized ? 0 : 150
        );
    };

    const { events, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useClubEvents(selectedClub?._id || null);

    const { indicatorStyle, shouldAnimate, setShouldAnimate, tabRefs } = useTabIndicator(activeTab, selectedClub, isPreviewMode);

    const handleEventSelect = (event: EventData | null, eventElement?: HTMLElement) => {
        setSelectedEvent(event);
        setIsCreateMode(false); // Selecting existing event = edit mode
        if (event) {
            setActiveTab('event-details');
        } else {
            returnToEvents();
        }
    };

    const handleEventSave = async () => {
        if (!selectedEvent || !selectedClub) return;

        // Basic validation
        if (!selectedEvent.name.trim()) {
            setSaveError('Event name is required');
            return;
        }
        if (!selectedEvent.location.trim()) {
            setSaveError('Event location is required');
            return;
        }
        if (!selectedEvent.date) {
            setSaveError('Event date is required');
            return;
        }
        if (!selectedEvent.startTime) {
            setSaveError('Start time is required');
            return;
        }
        if (!selectedEvent.endTime) {
            setSaveError('End time is required');
            return;
        }

        setSaveLoading(true);
        setSaveError(null);

        try {
            if (isCreateMode) {
                // Create new event
                const createRequest = eventService.convertToCreateRequest(selectedEvent);
                await eventService.createEvent(createRequest);
            } else {
                // Update existing event
                const updateRequest = eventService.convertToUpdateRequest(selectedEvent);
                await eventService.updateEvent(selectedEvent._id, updateRequest);
            }

            // Refresh the events list
            await refetchEvents();

            // Close the event editor and go back to event planner
            setSelectedEvent(null);
            setIsCreateMode(false);
            setActiveTabDirect('events'); // Use direct setter to avoid URL navigation cycle
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save event';
            setSaveError(errorMessage);
            console.error('Error saving event:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleEventCancel = () => {
        // Close the event editor and go back to event planner
        setSelectedEvent(null);
        setIsCreateMode(false);
        setActiveTabDirect('events'); // Use direct setter to avoid URL navigation cycle
    };

    const handleEventDelete = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEvent) return;

        setDeleteLoading(true);
        setSaveError(null);

        try {
            await eventService.deleteEvent(selectedEvent._id);

            // Refresh the events list
            await refetchEvents();

            // Close the event editor and go back to event planner
            setSelectedEvent(null);
            setIsCreateMode(false);
            setShowDeleteConfirm(false);
            setActiveTabDirect('events'); // Use direct setter to avoid URL navigation cycle
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete event';
            setSaveError(errorMessage);
            console.error('Error deleting event:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const handleCreateEvent = (selectedDate?: Date, sourceLayoutId?: string) => {
        // Create a new temporary event with pre-filled date
        // Use the sourceLayoutId as the event ID to enable layout animation
        const eventId = sourceLayoutId || 'create-event-button';
        const newEvent: EventData = {
            _id: eventId,
            club: selectedClub?._id || '',
            name: 'New Event',
            description: '',
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '10:00',
            location: '',
            type: EventType.UCSD_STUDENTS,
            tags: [],
        };

        setSelectedEvent(newEvent);
        setIsCreateMode(true); // This is create mode
        setActiveTab('event-details');
    };

    const [statsVisibleToAll, setStatsVisibleToAll] = useState(false);

    const showStatsTab = showOfficerView || statsVisibleToAll;

    const renderTabContent = () => {
        const contentKey = `${selectedClub?._id}-${activeTab}-${isPreviewMode}`;

        if (!selectedClub) return null;

        let content = null;
        if (activeTab === 'info') {
            content = showOfficerView ? <OfficerInfo club={selectedClub} /> : <MemberInfo club={selectedClub} />;
        } else if (activeTab === 'events') {
            content = showOfficerView ? (
                <EventPlanner
                    events={events}
                    selectedClub={selectedClub}
                    onEventSelect={handleEventSelect}
                    onCreateEvent={handleCreateEvent}
                    viewMode={eventPlannerViewMode}
                    onViewModeChange={setEventPlannerViewMode}
                />
            ) : (
                <Events events={events} loading={eventsLoading} error={eventsError} />
            );
        } else if (activeTab === 'event-details' && selectedEvent) {
            content = (
                <div>
                    {saveError && (
                        <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
                            <h4 className="text-error font-medium mb-2">Error saving event</h4>
                            <p className="text-error text-sm">{saveError}</p>
                        </div>
                    )}
                    <EventDetails
                        event={selectedEvent}
                        onEventChange={updatedEvent => {
                            setSaveError(null); // Clear errors when user makes changes
                            setSelectedEvent(updatedEvent);
                        }}
                        onDelete={handleEventDelete}
                        isCreateMode={isCreateMode}
                        isDeleteLoading={deleteLoading}
                    />
                </div>
            );
        } else if (activeTab === 'event-location' && selectedEvent) {
            content = <LocationPicker event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'event-tap' && selectedEvent) {
            content = <TAPIntegration event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'event-funding' && selectedEvent) {
            content = <ASFunding event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'stats' && (showOfficerView || showStatsTab)) {
            content = <Stats club={selectedClub} />;
        } else if (activeTab === 'stats') {
            setActiveTab('info');
            content = showOfficerView ? <OfficerInfo club={selectedClub} /> : <MemberInfo club={selectedClub} />;
        } else if (activeTab === 'membership') {
            content = <Membership club={selectedClub} isOwner={isOwner} />;
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={contentKey}
                    className="min-h-0"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    {content}
                </motion.div>
            </AnimatePresence>
        );
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                    <p className="mt-4 text-on-surface-variant">Loading your clubs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-error">Error loading clubs: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary-variant"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-6">
                    <div className={`flex-shrink-0 transition-all duration-300 ease-in-out ${isClubSelectorMinimized ? 'w-20' : 'w-80'}`}>
                        <ClubSelector
                            clubs={clubs}
                            selectedClub={selectedClub}
                            onClubSelect={setSelectedClub}
                            isMinimized={isClubSelectorMinimized}
                            isAnimating={isAnimating}
                            onToggleMinimize={handleToggleMinimize}
                            disabled={!!selectedEvent}
                        />
                        <RegisterClubButton />
                    </div>

                    <div className="flex-1 min-w-0">
                        {selectedClub ? (
                            <div className="space-y-6">
                                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                                    <ClubHeader
                                        club={selectedClub}
                                        isOfficer={isOfficer}
                                        isPreviewMode={isPreviewMode}
                                        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
                                        selectedEvent={selectedEvent}
                                        onEventSave={handleEventSave}
                                        onEventCancel={handleEventCancel}
                                        saveLoading={saveLoading || deleteLoading}
                                        isCreateMode={isCreateMode}
                                    />

                                    {isOfficer && (
                                        <div className="flex justify-end mb-4">
                                            <button
                                                onClick={() => setStatsVisibleToAll(!statsVisibleToAll)}
                                                className="px-2 py-1 text-sm bg-primary text-white rounded"
                                            >
                                                {statsVisibleToAll ? 'Hide Stats from Users' : 'Make Stats Visible to Everyone'}
                                            </button>
                                        </div>
                                    )}

                                    <TabNavigation
                                        showOfficerView={showOfficerView}
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                        indicatorStyle={indicatorStyle}
                                        shouldAnimate={shouldAnimate}
                                        tabRefs={tabRefs}
                                        setShouldAnimate={setShouldAnimate}
                                        selectedEvent={selectedEvent}
                                        showStatsTab={showStatsTab}
                                    />
                                </div>

                                {renderTabContent()}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-surface rounded-lg shadow-lg p-6 max-w-md w-full m-4 border border-outline-variant">
                        <h3 className="text-lg font-semibold text-on-surface mb-4">Delete Event</h3>
                        <p className="text-on-surface-variant mb-6">
                            Are you sure you want to delete "{selectedEvent.name}"? This action cannot be undone.
                        </p>
                        {saveError && (
                            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                                <p className="text-error text-sm">{saveError}</p>
                            </div>
                        )}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                                className="px-4 py-2 rounded-lg text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-error text-on-error hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {deleteLoading ? 'Deleting...' : 'Delete Event'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
