import React, { useState, useCallback } from 'react';
import WebDatePicker from './WebDatePicker';
import WebTimePicker from './WebTimePicker';

interface WebDateTimeRangePickerProps {
    date: Date | undefined;
    startTime: Date | undefined;
    endTime: Date | undefined;
    onDateChange: (date: Date) => void;
    onStartTimeChange: (time: Date) => void;
    onEndTimeChange: (time: Date) => void;
    onDismiss: () => void;
    onDone?: (date: Date, startTime: Date, endTime: Date) => void;
}

const WebDateTimeRangePicker: React.FC<WebDateTimeRangePickerProps> = ({
    date,
    startTime,
    endTime,
    onDateChange,
    onStartTimeChange,
    onEndTimeChange,
    onDismiss,
    onDone,
}) => {
    const currentDate = date || new Date();
    const currentStartTime = startTime || new Date(currentDate.getTime());
    const currentEndTime = endTime || new Date(currentDate.getTime() + 60 * 60 * 1000); // Default to 1 hour later

    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [selectedStartTime, setSelectedStartTime] = useState(currentStartTime);
    const [selectedEndTime, setSelectedEndTime] = useState(currentEndTime);

    const useHorizontalLayout = window.innerWidth >= 768; // Slightly larger breakpoint for 3-panel layout

    const handleDateSelected = useCallback((newDate: Date) => {
        setSelectedDate(prevDate => {
            const updatedDate = new Date(prevDate);
            updatedDate.setFullYear(newDate.getFullYear());
            updatedDate.setMonth(newDate.getMonth());
            updatedDate.setDate(newDate.getDate());

            // Update both start and end times with the new date
            setSelectedStartTime(prevStartTime => {
                const updatedStartTime = new Date(prevStartTime);
                updatedStartTime.setFullYear(newDate.getFullYear());
                updatedStartTime.setMonth(newDate.getMonth());
                updatedStartTime.setDate(newDate.getDate());
                return updatedStartTime;
            });

            setSelectedEndTime(prevEndTime => {
                const updatedEndTime = new Date(prevEndTime);
                updatedEndTime.setFullYear(newDate.getFullYear());
                updatedEndTime.setMonth(newDate.getMonth());
                updatedEndTime.setDate(newDate.getDate());
                return updatedEndTime;
            });

            return updatedDate;
        });
    }, []);

    const handleStartTimeSelected = useCallback((newTime: Date) => {
        setSelectedStartTime(newTime);
    }, []);

    const handleEndTimeSelected = useCallback((newTime: Date) => {
        setSelectedEndTime(newTime);
    }, []);

    const handleDone = () => {
        onDateChange(selectedDate);
        onStartTimeChange(selectedStartTime);
        onEndTimeChange(selectedEndTime);

        if (onDone) {
            onDone(selectedDate, selectedStartTime, selectedEndTime);
        } else {
            onDismiss();
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const getDuration = () => {
        const diffMs = selectedEndTime.getTime() - selectedStartTime.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h`;
        } else {
            return `${minutes}m`;
        }
    };

    return (
        <div className="bg-surface rounded-lg shadow-lg w-auto max-w-4xl">
            {/* Header */}
            <div className="bg-primary-container p-6 rounded-t-lg">
                <div className="text-on-primary-container text-center text-lg font-medium mb-2">{formatDate(selectedDate)}</div>
                <div className="text-on-primary-container text-center">
                    <div className="text-xl font-bold">
                        {formatTime(selectedStartTime)} - {formatTime(selectedEndTime)}
                    </div>
                    <div className="text-sm opacity-90 mt-1">Duration: {getDuration()}</div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex">
                {/* Date Picker */}
                <div className="border-r border-outline">
                    <div className="font-medium text-on-surface-variant px-4 pt-4 pb-2">Date</div>
                    <WebDatePicker selectedDate={selectedDate} onDateSelected={handleDateSelected} />
                </div>

                {/* Time Picker Section */}
                <div className="flex-1">
                    <div>
                        <div className="font-medium text-on-surface-variant px-4 pt-3 pb-1">Start Time</div>
                        <WebTimePicker selectedDate={selectedStartTime} onTimeSelected={handleStartTimeSelected} />
                    </div>

                    <div className="border-t border-outline">
                        <div className="font-medium text-on-surface-variant px-4 pt-3 pb-1">End Time</div>
                        <WebTimePicker selectedDate={selectedEndTime} onTimeSelected={handleEndTimeSelected} />
                    </div>
                </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end p-4 border-t border-outline">
                <button
                    onClick={onDismiss}
                    className="bg-surface border border-outline rounded-lg px-4 py-2 mr-2 hover:bg-surface-variant cursor-pointer"
                >
                    <span className="text-on-surface">Cancel</span>
                </button>

                <button onClick={handleDone} className="bg-primary rounded-lg px-4 py-2 hover:bg-primary/90 cursor-pointer">
                    <span className="text-on-primary">Done</span>
                </button>
            </div>
        </div>
    );
};

export default WebDateTimeRangePicker;
