import { EventData, EventType } from '@clubhive/shared';
import { DangerZone } from '../components';

interface EventDetailsProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
    onDelete?: () => void;
    isCreateMode?: boolean;
    isDeleteLoading?: boolean;
}

export function EventDetails({ event, onEventChange, onDelete, isCreateMode = false, isDeleteLoading = false }: EventDetailsProps) {
    return (
        <div>
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
                            required
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
                            <label className="block text-sm font-medium text-on-surface mb-2">Date</label>
                            <input
                                type="date"
                                value={event.date}
                                onChange={e => onEventChange({ ...event, date: e.target.value })}
                                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Event Type</label>
                            <select
                                value={event.type}
                                onChange={e => onEventChange({ ...event, type: e.target.value as EventType })}
                                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
                            >
                                <option value={EventType.CLUB_OFFICERS}>Club Officers</option>
                                <option value={EventType.CLUB_MEMBERS}>Club Members</option>
                                <option value={EventType.UCSD_STUDENTS}>UCSD Students</option>
                                <option value={EventType.ANYONE}>Anyone</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">Start Time</label>
                            <input
                                type="time"
                                value={event.startTime}
                                onChange={e => onEventChange({ ...event, startTime: e.target.value })}
                                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">End Time</label>
                            <input
                                type="time"
                                value={event.endTime}
                                onChange={e => onEventChange({ ...event, endTime: e.target.value })}
                                className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
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
                            required
                        />
                    </div>
                </div>
            </div>

            {!isCreateMode && onDelete && <DangerZone event={event} onDelete={onDelete} isDeleteLoading={isDeleteLoading} />}
        </div>
    );
}
