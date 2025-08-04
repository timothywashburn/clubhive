import { EventData, EventType } from '@clubhive/shared';
import { DeleteDangerZone } from '../../../../components/DangerZone';
import { WebDateTimeRangePicker } from '../../../../components/date-picker';
import React, { useState } from 'react';

interface EventDetailsProps {
    event: EventData;
    onEventChange: (event: EventData) => void;
    onDelete?: () => void;
    isCreateMode?: boolean;
    isDeleteLoading?: boolean;
}

export function EventDetails({ event, onEventChange, onDelete, isCreateMode = false, isDeleteLoading = false }: EventDetailsProps) {
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);

    // Helper to create Date objects from event data
    const getEventDate = () => {
        return new Date(event.date + 'T00:00:00');
    };

    const getEventStartTime = () => {
        return new Date(event.date + 'T' + event.startTime + ':00');
    };

    const getEventEndTime = () => {
        return new Date(event.date + 'T' + event.endTime + ':00');
    };

    // Format date and time range for display
    const formatEventDateTime = () => {
        const date = getEventDate();
        const startTime = getEventStartTime();
        const endTime = getEventEndTime();

        const dateStr = date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const startTimeStr = startTime.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        const endTimeStr = endTime.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return `${dateStr} from ${startTimeStr} to ${endTimeStr}`;
    };

    const handleDateTimeRangeChange = (date: Date, startTime: Date, endTime: Date) => {
        const dateString = date.toISOString().split('T')[0];
        const startTimeString = startTime.toTimeString().slice(0, 5);
        const endTimeString = endTime.toTimeString().slice(0, 5);

        onEventChange({
            ...event,
            date: dateString,
            startTime: startTimeString,
            endTime: endTimeString,
        });

        setShowDateTimePicker(false);
    };

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
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">Date & Time</label>
                        <button
                            onClick={() => setShowDateTimePicker(true)}
                            className="w-full px-4 py-3 border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface text-left hover:bg-surface-variant cursor-pointer"
                        >
                            {formatEventDateTime()}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
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

            {!isCreateMode && onDelete && (
                <DeleteDangerZone
                    itemName={event.name}
                    itemType="Event"
                    onDelete={onDelete}
                    isDeleteLoading={isDeleteLoading}
                />
            )}

            {/* Date Time Range Picker Modal */}
            {showDateTimePicker && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <WebDateTimeRangePicker
                        date={getEventDate()}
                        startTime={getEventStartTime()}
                        endTime={getEventEndTime()}
                        onDateChange={() => {}} // Individual change handlers not needed
                        onStartTimeChange={() => {}} // Individual change handlers not needed
                        onEndTimeChange={() => {}} // Individual change handlers not needed
                        onDismiss={() => setShowDateTimePicker(false)}
                        onDone={handleDateTimeRangeChange}
                    />
                </div>
            )}
        </div>
    );
}
