import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Event } from '../types';
import { Events } from './Events';
import { WebDateTimePicker } from '../../../components/date-picker';

interface EventPlannerProps {
    events: Event[];
}

export function EventPlanner({ events }: EventPlannerProps) {
    const [eventDate, setEventDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (date: Date) => {
        setEventDate(date);
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">
                    Create New Event
                </h3>
                <div className="space-y-4 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">
                            Event Title
                        </label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            placeholder="Enter event title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            rows={3}
                            placeholder="Describe the event"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-on-surface mb-1">
                                Date & Time
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowDatePicker(true)}
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface text-left hover:bg-surface-variant cursor-pointer flex items-center justify-between"
                            >
                                <span>{formatDateTime(eventDate)}</span>
                                <Calendar className="h-5 w-5 text-on-surface-variant" />
                            </button>
                            {showDatePicker && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <WebDateTimePicker
                                        date={eventDate}
                                        onDateChange={handleDateChange}
                                        onDismiss={() =>
                                            setShowDatePicker(false)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                                placeholder="Event location"
                            />
                        </div>
                    </div>
                    <button className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium cursor-pointer">
                        Create Event
                    </button>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium text-on-surface mb-4">
                    Upcoming Events
                </h3>
                <Events events={events} />
            </div>
        </div>
    );
}
