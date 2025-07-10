import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Event } from '../types';

interface EventsProps {
    events: Event[];
}

export function Events({ events }: EventsProps) {
    return (
        <div className="space-y-4">
            {events.map(event => (
                <div
                    key={event.id}
                    className="bg-surface rounded-lg shadow p-6 border border-outline-variant"
                >
                    <h3 className="text-lg font-medium text-on-surface mb-2">
                        {event.title}
                    </h3>
                    <p className="text-on-surface-variant mb-4">
                        {event.description}
                    </p>
                    <div className="flex items-center text-sm text-on-surface-variant space-x-4">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {event.date}
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {event.time}
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                        </div>
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {event.attendees} attending
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
