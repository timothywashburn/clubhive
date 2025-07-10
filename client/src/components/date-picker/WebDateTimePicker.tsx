import React, { useState, useCallback } from 'react';
import WebDatePicker from './WebDatePicker';
import WebTimePicker from './WebTimePicker';

interface WebDateTimePickerProps {
    date: Date | undefined;
    onDateChange: (date: Date) => void;
    onDismiss: () => void;
}

const WebDateTimePicker: React.FC<WebDateTimePickerProps> = ({
    date,
    onDateChange,
    onDismiss,
}) => {
    const currentDate = date || new Date();
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const useHorizontalLayout = window.innerWidth >= 640;

    const handleDateSelected = useCallback((newDate: Date) => {
        setSelectedDate(prevDate => {
            const updatedDate = new Date(prevDate);
            updatedDate.setFullYear(newDate.getFullYear());
            updatedDate.setMonth(newDate.getMonth());
            updatedDate.setDate(newDate.getDate());
            return updatedDate;
        });
    }, []);

    const handleTimeSelected = useCallback((newDate: Date) => {
        setSelectedDate(prevDate => {
            const updatedDate = new Date(prevDate);
            updatedDate.setHours(newDate.getHours());
            updatedDate.setMinutes(newDate.getMinutes());
            updatedDate.setSeconds(newDate.getSeconds());
            return updatedDate;
        });
    }, []);

    const handleDone = () => {
        onDateChange(selectedDate);
        onDismiss();
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

    return (
        <div
            className={`bg-surface rounded-lg shadow-lg ${useHorizontalLayout ? 'w-auto' : 'w-80'} max-w-full`}
        >
            {/* Header */}
            <div className="bg-primary-container p-4 rounded-t-lg">
                <div className="text-on-primary-container text-center text-lg font-medium">
                    {formatDate(selectedDate)}
                </div>
                <div className="text-on-primary-container text-center text-xl font-bold">
                    {formatTime(selectedDate)}
                </div>
            </div>

            {/* Main content */}
            <div
                className={`flex ${useHorizontalLayout ? 'flex-row' : 'flex-col'}`}
            >
                <div
                    className={`${useHorizontalLayout ? 'border-r' : 'border-b'} border-outline`}
                >
                    <div className="font-medium text-on-surface-variant px-4 pt-3 pb-1">
                        Date
                    </div>
                    <WebDatePicker
                        selectedDate={selectedDate}
                        onDateSelected={handleDateSelected}
                    />
                </div>

                <div>
                    <div className="font-medium text-on-surface-variant px-4 pt-3 pb-1">
                        Time
                    </div>
                    <WebTimePicker
                        selectedDate={selectedDate}
                        onTimeSelected={handleTimeSelected}
                    />
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

                <button
                    onClick={handleDone}
                    className="bg-primary rounded-lg px-4 py-2 hover:bg-primary/90 cursor-pointer"
                >
                    <span className="text-on-primary">Done</span>
                </button>
            </div>
        </div>
    );
};

export default WebDateTimePicker;
