import { EventData } from '@clubhive/shared';
import { Events } from '../../components/Events';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface AgendaViewProps {
    events: EventData[];
    onEditEvent?: (event: EventData) => void;
}

function TableHeader() {
    return (
        <div className="hidden md:flex bg-surface-variant px-6 py-3 border-b border-outline-variant text-sm font-medium text-on-surface-variant">
            <div className="flex-1 max-w-[35%] pr-4">Event</div>
            <div className="w-[25%] px-2">Date & Time</div>
            <div className="w-[20%] px-2">Location</div>
            <div className="w-[20%] px-2">Attendees</div>
        </div>
    );
}

function AgendaItemCard({ event, onEditEvent }: { event: EventData; onEditEvent?: (event: EventData) => void }) {
    return (
        <div
            className="hidden md:flex bg-surface border-b border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors"
            onClick={() => onEditEvent?.(event)}
        >
            <div className="flex-1 max-w-[35%] pr-4 py-4 px-6">
                <div className="flex flex-col">
                    <h3 className="text-on-surface text-sm font-semibold mb-1">{event.name}</h3>
                    <p className="text-on-surface-variant text-xs line-clamp-2">{event.description}</p>
                </div>
            </div>

            <div className="w-[25%] px-2 py-4 flex items-center">
                <div className="flex items-center">
                    <Clock className="h-3 w-3 text-on-surface-variant mr-1" />
                    <div className="flex flex-col">
                        <span className="text-on-surface-variant text-xs">{new Date(event.date + 'T00:00:00').toLocaleDateString()}</span>
                        <span className="text-on-surface-variant text-xs">
                            {event.startTime} - {event.endTime}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-[20%] px-2 py-4 flex items-center">
                <div className="flex items-center">
                    <MapPin className="h-3 w-3 text-on-surface-variant mr-1" />
                    <span className="text-on-surface-variant text-xs truncate">{event.location}</span>
                </div>
            </div>

            <div className="w-[20%] px-2 py-4 flex items-center">
                <div className="flex items-center">
                    <Users className="h-3 w-3 text-on-surface-variant mr-1" />
                    <span className="text-on-surface-variant text-xs">{event.type}</span>
                </div>
            </div>
        </div>
    );
}

export function AgendaView({ events, onEditEvent }: AgendaViewProps) {
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
        <>
            {/* Mobile/Small screen view */}
            <div className="md:hidden">
                <Events events={events} onEditEvent={onEditEvent} />
            </div>

            {/* Desktop/Large screen table view */}
            <div className="hidden md:block space-y-6">
                {sortedMonths.map(month => (
                    <div key={month}>
                        <h3 className="text-lg font-semibold text-on-surface mb-3">{month}</h3>
                        <div className="bg-surface rounded-lg overflow-hidden border border-outline-variant">
                            <TableHeader />
                            {eventsByMonth[month].map(event => (
                                <AgendaItemCard key={event._id} event={event} onEditEvent={onEditEvent} />
                            ))}
                        </div>
                    </div>
                ))}
                {sortedMonths.length === 0 && <div className="text-center py-8 text-on-surface-variant">No events scheduled.</div>}
            </div>
        </>
    );
}
