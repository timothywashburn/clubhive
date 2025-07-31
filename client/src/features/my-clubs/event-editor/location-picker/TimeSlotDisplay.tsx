import { TimeSlot } from './types';

interface TimeSlotDisplayProps {
    availability: TimeSlot[];
    className?: string;
}

export function TimeSlotDisplay({ availability, className = '' }: TimeSlotDisplayProps) {
    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const calculateDuration = (slot: TimeSlot) => {
        const start = new Date(slot.start_time);
        const end = new Date(slot.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return hours;
    };

    if (availability.length === 0) {
        return <div className={`text-sm text-on-surface-variant ${className}`}>No availability</div>;
    }

    return (
        <div className={`space-y-1 ${className}`}>
            {availability.map((slot, index) => {
                const duration = calculateDuration(slot);
                const isLongSlot = duration >= 8;

                return (
                    <div
                        key={index}
                        className={`text-xs px-2 py-1 rounded-md border ${
                            isLongSlot
                                ? 'bg-primary/10 border-primary/30 text-primary'
                                : 'bg-surface-variant/50 border-outline-variant text-on-surface-variant'
                        }`}
                    >
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        <span className="ml-1 opacity-75">({duration.toFixed(1)}h)</span>
                    </div>
                );
            })}
        </div>
    );
}
