import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { EventData } from '@clubhive/shared';

interface EventsProps {
    events: EventData[];
    loading?: boolean;
    error?: string | null;
    onEditEvent?: (event: EventData) => void;
}

export function Events({ events, loading, error, onEditEvent }: EventsProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-on-surface-variant">Loading events...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-error">Error loading events: {error}</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-on-surface-variant">No events scheduled for this club.</p>
            </div>
        );
    }

    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.date + 'T' + (a.startTime || '00:00'));
        const dateB = new Date(b.date + 'T' + (b.startTime || '00:00'));
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="space-y-4">
            {sortedEvents.map(event => (
                <div
                    key={event._id}
                    onClick={() => onEditEvent?.(event)}
                    className="bg-surface rounded-lg shadow p-6 border border-outline-variant cursor-pointer hover:bg-surface-variant transition-colors"
                >
                    <h3 className="text-lg font-medium text-on-surface mb-2">{event.name}</h3>
                    <p className="text-on-surface-variant mb-4">{event.description}</p>
                    <div className="flex items-center text-sm text-on-surface-variant space-x-4">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(event.date + 'T00:00:00').toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.startTime} - {event.endTime}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                        </div>
                        {event.tags && event.tags.length > 0 && (
                            <div className="flex items-center">
                                <Tag className="w-4 h-4 mr-1" />
                                {event.tags[0].text}
                                {event.tags.length > 1 && ` +${event.tags.length - 1}`}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
