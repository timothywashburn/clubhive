import { EventData } from '@clubhive/shared';
import { Events } from '../../pages/Events.tsx';
import { Calendar, Clock, MapPin, Users, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgendaViewProps {
    events: EventData[];
    onEditEvent?: (event: EventData, eventElement?: HTMLElement) => void;
    onViewModeChange?: (mode: 'calendar' | 'agenda') => void;
}

function TableHeader() {
    return (
        <div className="hidden md:flex bg-surface-variant px-6 py-3 border-b border-outline-variant text-sm font-medium text-on-surface-variant">
            <div className="w-[25%] pr-4">Event Name</div>
            <div className="w-[20%] px-2">Date & Time</div>
            <div className="w-[20%] px-2">Location</div>
            <div className="w-[20%] px-2">Tags</div>
            <div className="w-[15%] px-2">Attendees</div>
        </div>
    );
}

function AgendaItemCard({
    event,
    onEditEvent,
}: {
    event: EventData;
    onEditEvent?: (event: EventData, eventElement?: HTMLElement) => void;
}) {
    const handleClick = (e: React.MouseEvent) => {
        const eventNameElement = e.currentTarget.querySelector('[data-event-name]') as HTMLElement;
        onEditEvent?.(event, eventNameElement);
    };

    return (
        <div
            className="hidden md:flex bg-surface border-b border-outline-variant last:border-b-0 hover:bg-surface-variant cursor-pointer transition-colors group"
            onClick={handleClick}
        >
            <motion.div
                className="w-[25%] pr-4 py-3 px-6 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.05 }}
            >
                <motion.div
                    data-event-name
                    layoutId={`event-${event._id}`}
                    className="text-sm bg-primary text-on-primary px-1 py-0.5 rounded cursor-pointer max-w-full"
                >
                    <span className="truncate block">{event.name}</span>
                </motion.div>
            </motion.div>

            <motion.div
                className="w-[20%] px-2 py-3 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.1 }}
            >
                <div className="flex items-center">
                    <Clock className="h-4 w-4 text-on-surface-variant mr-2" />
                    <div className="flex flex-col">
                        <span className="text-on-surface text-xs font-medium">
                            {new Date(event.date + 'T00:00:00').toLocaleDateString()}
                        </span>
                        <span className="text-on-surface-variant text-xs">
                            {event.startTime} - {event.endTime}
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="w-[20%] px-2 py-3 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.15 }}
            >
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-on-surface-variant mr-2" />
                    <span className="text-on-surface-variant text-xs truncate">{event.location || 'TBD'}</span>
                </div>
            </motion.div>

            <motion.div
                className="w-[20%] px-2 py-3 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.2 }}
            >
                <div className="flex flex-wrap gap-1">
                    {event.tags && event.tags.length > 0 ? (
                        <>
                            {event.tags.slice(0, 2).map(tag => (
                                <span key={tag._id} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                    {tag.text}
                                </span>
                            ))}
                            {event.tags.length > 2 && <span className="text-xs text-on-surface-variant">+{event.tags.length - 2}</span>}
                        </>
                    ) : (
                        <span className="text-on-surface-variant text-xs">—</span>
                    )}
                </div>
            </motion.div>

            <motion.div
                className="w-[15%] px-2 py-3 flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.25 }}
            >
                <div className="flex items-center">
                    <Users className="h-4 w-4 text-on-surface-variant mr-2" />
                    <span className="text-on-surface-variant text-xs">{event.type}</span>
                </div>
            </motion.div>
        </div>
    );
}

export function AgendaView({ events, onEditEvent, onViewModeChange }: AgendaViewProps) {
    // Group events by month
    const groupEventsByMonth = (events: EventData[]) => {
        const grouped: { [key: string]: EventData[] } = {};

        events.forEach(event => {
            const eventDate = new Date(event.date);
            const monthKey = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });

            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }
            grouped[monthKey].push(event);
        });

        // Sort events within each month by date
        Object.keys(grouped).forEach(month => {
            grouped[month].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });

        return grouped;
    };

    const eventsByMonth = groupEventsByMonth(events);
    const sortedMonths = Object.keys(eventsByMonth).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });

    return (
        <div className="w-full space-y-6">
            {/* Header with toggle */}
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <h3 className="text-xl font-semibold text-on-surface">Upcoming Events</h3>
                        <span className="ml-3 text-sm text-on-surface-variant">
                            {events.length} {events.length === 1 ? 'event' : 'events'}
                        </span>
                    </div>
                    <div className="flex bg-surface-variant rounded-md p-1">
                        <button
                            onClick={() => onViewModeChange?.('calendar')}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface"
                        >
                            <Calendar className="h-4 w-4" />
                            Calendar
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer bg-primary text-on-primary">
                            <List className="h-4 w-4" />
                            Table
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile/Small screen view */}
            <div className="md:hidden">
                <Events events={events} onEditEvent={onEditEvent} />
            </div>

            {/* Desktop/Large screen table view */}
            <div className="hidden md:block space-y-6">
                {sortedMonths.map((month, monthIndex) => (
                    <motion.div
                        key={month}
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ duration: 0.3, delay: monthIndex * 0.1 }}
                    >
                        <h4 className="text-lg font-semibold text-on-surface mb-3 flex items-center">
                            {month}
                            <span className="ml-2 text-sm font-normal text-on-surface-variant">
                                ({eventsByMonth[month].length} {eventsByMonth[month].length === 1 ? 'event' : 'events'})
                            </span>
                        </h4>
                        <motion.div
                            className="bg-surface rounded-lg overflow-hidden border border-outline-variant shadow"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: monthIndex * 0.1 + 0.1 }}
                        >
                            <TableHeader />
                            <AnimatePresence>
                                {eventsByMonth[month].map(event => (
                                    <AgendaItemCard key={event._id} event={event} onEditEvent={onEditEvent} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                ))}
                {sortedMonths.length === 0 && (
                    <div className="bg-surface rounded-lg shadow p-12 border border-outline-variant">
                        <div className="text-center">
                            <List className="h-12 w-12 text-on-surface-variant mx-auto mb-4 opacity-50" />
                            <p className="text-on-surface-variant text-lg">No events scheduled</p>
                            <p className="text-on-surface-variant text-sm mt-1">Create your first event to get started</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
