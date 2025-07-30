import { EventData } from '@clubhive/shared';

interface EventDetailsProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
}

export function EventDetails({ event, onEventChange }: EventDetailsProps) {
    return (
        <div className="bg-surface rounded-lg shadow p-8 border border-outline-variant min-h-[600px]">
            <h4 className="text-xl font-semibold text-on-surface mb-6">Event Details</h4>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Event Name</label>
                    <input
                        type="text"
                        value={event.name}
                        onChange={e => onEventChange({ ...event, name: e.target.value })}
                        className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Description</label>
                    <textarea
                        value={event.description}
                        onChange={e => onEventChange({ ...event, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface resize-none"
                        placeholder="Describe your event..."
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">Start Time</label>
                        <input
                            type="time"
                            value={event.startTime}
                            onChange={e => onEventChange({ ...event, startTime: e.target.value })}
                            className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">End Time</label>
                        <input
                            type="time"
                            value={event.endTime}
                            onChange={e => onEventChange({ ...event, endTime: e.target.value })}
                            className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Location</label>
                    <input
                        type="text"
                        value={event.location}
                        onChange={e => onEventChange({ ...event, location: e.target.value })}
                        className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                        placeholder="Where will this event take place?"
                    />
                </div>
            </div>
        </div>
    );
}
