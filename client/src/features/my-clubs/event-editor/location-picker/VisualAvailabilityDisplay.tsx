import { TimeSlot, VenueFilterType } from './types';

interface VisualAvailabilityDisplayProps {
    availability: TimeSlot[];
    filters?: VenueFilterType;
    className?: string;
    height?: number; // Height in pixels, default 120
}

export function VisualAvailabilityDisplay({ availability, filters, className = '', height = 120 }: VisualAvailabilityDisplayProps) {
    const startHour = 8;
    const endHour = 23;
    const totalMinutes = (endHour - startHour) * 60; // Total minutes from 8 AM to 11 PM

    // Helper function to convert time to minutes from start hour
    const timeToMinutes = (timeString: string) => {
        const date = new Date(timeString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return (hours - startHour) * 60 + minutes;
    };

    // Helper function to check if an availability slot meets criteria
    const meetsCriteria = (slot: TimeSlot) => {
        if (!filters) return true;

        if (filters.searchMode === 'duration' && filters.minDuration > 0) {
            const start = new Date(slot.start_time);
            const end = new Date(slot.end_time);
            const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return duration >= filters.minDuration;
        }

        if (filters.searchMode === 'specific-window' && filters.specificWindow) {
            const slotStart = new Date(slot.start_time);
            const slotEnd = new Date(slot.end_time);
            const windowStart = filters.specificWindow.startTime;
            const windowEnd = filters.specificWindow.endTime;

            // Compare only the time portions (hours and minutes)
            const slotStartTime = slotStart.getHours() * 60 + slotStart.getMinutes();
            const slotEndTime = slotEnd.getHours() * 60 + slotEnd.getMinutes();
            const windowStartTime = windowStart.getHours() * 60 + windowStart.getMinutes();
            const windowEndTime = windowEnd.getHours() * 60 + windowEnd.getMinutes();

            // Check if the slot completely contains the desired time window
            return slotStartTime <= windowStartTime && slotEndTime >= windowEndTime;
        }

        return true;
    };

    // Create time grid lines every hour
    const hourLines = Array.from({ length: endHour - startHour + 1 }, (_, i) => {
        const hour = startHour + i;
        const position = ((i * 60) / totalMinutes) * 100;
        return { hour, position };
    });

    return (
        <div className={`relative ${className}`} style={{ height: `${height}px` }}>
            {/* Background with hour grid lines */}
            <div className="absolute inset-0 bg-surface-variant/20 rounded-md">
                {hourLines.map(({ hour, position }) => (
                    <div
                        key={hour}
                        className="absolute left-0 right-0 border-t border-outline-variant/30"
                        style={{ top: `${position}%` }}
                    />
                ))}
            </div>

            {/* Availability blocks */}
            <div className="absolute inset-0">
                {availability.map((slot, index) => {
                    const startMinutes = Math.max(0, timeToMinutes(slot.start_time));
                    const endMinutes = Math.min(totalMinutes, timeToMinutes(slot.end_time));

                    if (startMinutes >= endMinutes) return null;

                    const topPercent = (startMinutes / totalMinutes) * 100;
                    const heightPercent = ((endMinutes - startMinutes) / totalMinutes) * 100;
                    const meetsFilter = meetsCriteria(slot);

                    const formatTime = (timeString: string) => {
                        const date = new Date(timeString);
                        return date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        });
                    };

                    return (
                        <div
                            key={index}
                            className={`absolute left-1 right-1 rounded-sm border transition-all hover:shadow-sm ${
                                meetsFilter
                                    ? 'bg-orange-400 border-orange-500 hover:bg-orange-500' // Meets criteria
                                    : 'bg-gray-300 border-gray-400 hover:bg-gray-400' // Doesn't meet criteria
                            }`}
                            style={{
                                top: `${topPercent}%`,
                                height: `${heightPercent}%`,
                                minHeight: '8px',
                            }}
                            title={`${new Date(slot.start_time).toLocaleDateString()} ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)} ${
                                meetsFilter ? '✓' : '✗'
                            }`}
                        >
                            {heightPercent > 8 && (
                                <div className="absolute inset-x-1 top-1 text-xs text-white font-medium truncate">
                                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Search window indicator (if in specific-window mode) */}
            {filters?.searchMode === 'specific-window' && filters.specificWindow && (
                <div className="absolute inset-0 pointer-events-none">
                    {(() => {
                        const windowStart = filters.specificWindow.startTime;
                        const windowEnd = filters.specificWindow.endTime;

                        // Convert to minutes from start hour (8 AM) - ignore the date, just use time
                        const windowStartMinutes = (windowStart.getHours() - startHour) * 60 + windowStart.getMinutes();
                        const windowEndMinutes = (windowEnd.getHours() - startHour) * 60 + windowEnd.getMinutes();

                        // Handle overnight time windows
                        let adjustedEndMinutes = windowEndMinutes;
                        if (windowEndMinutes < windowStartMinutes) {
                            adjustedEndMinutes = windowEndMinutes + 24 * 60; // Add 24 hours
                        }

                        // Only show if the window overlaps with our display time (8 AM - 11 PM)
                        if (windowStartMinutes >= totalMinutes || adjustedEndMinutes <= 0) return null;

                        const displayStartMinutes = Math.max(0, windowStartMinutes);
                        const displayEndMinutes = Math.min(totalMinutes, adjustedEndMinutes);

                        const topPercent = (displayStartMinutes / totalMinutes) * 100;
                        const heightPercent = ((displayEndMinutes - displayStartMinutes) / totalMinutes) * 100;

                        if (heightPercent <= 0) return null;

                        return (
                            <div
                                className="absolute left-0 right-0 border-2 border-primary border-dashed bg-primary/10 rounded-sm"
                                style={{
                                    top: `${topPercent}%`,
                                    height: `${heightPercent}%`,
                                }}
                                title={`Target window: ${windowStart.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - ${windowEnd.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`}
                            />
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
