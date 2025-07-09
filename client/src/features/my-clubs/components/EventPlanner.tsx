import { Event } from '../types';
import { Events } from './Events';

interface EventPlannerProps {
    events: Event[];
}

export function EventPlanner({ events }: EventPlannerProps) {
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
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">
                                Time
                            </label>
                            <input
                                type="time"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            />
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
