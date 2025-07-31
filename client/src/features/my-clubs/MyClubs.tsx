import { useState } from 'react';
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
import { EventDetails, LocationPicker, TAPIntegration, ASFunding } from './event-editor';
import { EventData } from '@clubhive/shared';

export function MyClubs() {
    const { clubs, loading, error } = useMyClubsData();

    const { selectedClub, setSelectedClub, activeTab, setActiveTab, isPreviewMode, setIsPreviewMode, isOfficer, isOwner, showOfficerView } =
        useClubState();

    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
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

    const { events, loading: eventsLoading, error: eventsError } = useClubEvents(selectedClub?._id || null);

    const { indicatorStyle, shouldAnimate, setShouldAnimate, tabRefs } = useTabIndicator(activeTab, selectedClub, isPreviewMode);

    const handleEventSelect = (event: EventData | null, eventElement?: HTMLElement) => {
        setSelectedEvent(event);
        if (event) {
            setActiveTab('event-details');
        } else {
            setActiveTab('events');
        }
    };

    const handleEventSave = () => {
        // TODO: Implement event save logic
        setSelectedEvent(null);
        setActiveTab('events');
    };

    const handleEventCancel = () => {
        setSelectedEvent(null);
        setActiveTab('events');
    };

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
                    viewMode={eventPlannerViewMode}
                    onViewModeChange={setEventPlannerViewMode}
                />
            ) : (
                <Events events={events} loading={eventsLoading} error={eventsError} />
            );
        } else if (activeTab === 'event-details' && selectedEvent) {
            content = <EventDetails event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'event-location' && selectedEvent) {
            content = <LocationPicker event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'event-tap' && selectedEvent) {
            content = <TAPIntegration event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'event-funding' && selectedEvent) {
            content = <ASFunding event={selectedEvent} onEventChange={setSelectedEvent} />;
        } else if (activeTab === 'stats' && showOfficerView) {
            content = <Stats club={selectedClub} />;
        } else if (activeTab === 'stats' && isPreviewMode) {
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
                                    />

                                    <TabNavigation
                                        showOfficerView={showOfficerView}
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                        indicatorStyle={indicatorStyle}
                                        shouldAnimate={shouldAnimate}
                                        tabRefs={tabRefs}
                                        setShouldAnimate={setShouldAnimate}
                                        selectedEvent={selectedEvent}
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
        </div>
    );
}
