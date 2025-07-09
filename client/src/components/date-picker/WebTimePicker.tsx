import React, { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
    selectedDate: Date;
    onTimeSelected: (date: Date) => void;
}

interface TimeInputProps {
    value: string;
    maxValue: number;
    onChangeText: (text: string) => void;
    onComplete?: () => void;
    placeholder?: string;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const TimeInput: React.FC<TimeInputProps> = ({
    value,
    maxValue,
    onChangeText,
    onComplete,
    placeholder = '00',
    inputRef,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        if (!/^\d*$/.test(text)) return;
        if (text.length > 2) return;

        const numValue = parseInt(text || '0', 10);
        if (numValue > maxValue) return;

        onChangeText(text);

        if (text.length === 2 && onComplete) onComplete();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            e.target.select();
        }, 10);
    };

    return (
        <input
            ref={inputRef}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder={placeholder}
            className="bg-surface text-on-surface w-12 h-12 text-center text-xl border-b-2 border-outline focus:border-primary mx-1 focus:outline-none"
        />
    );
};

const WebTimePicker: React.FC<TimePickerProps> = ({
    selectedDate,
    onTimeSelected,
}) => {
    // Convert 24h time to 12h format for display
    const to12HourFormat = (hours24: number) => {
        if (hours24 === 0) return 12;
        if (hours24 > 12) return hours24 - 12;
        return hours24;
    };

    // State for input fields as strings for better control
    const [hoursStr, setHoursStr] = useState(
        to12HourFormat(selectedDate.getHours()).toString()
    );
    const [minutesStr, setMinutesStr] = useState(
        selectedDate.getMinutes().toString().padStart(2, '0')
    );
    const [ampm, setAmpm] = useState(
        selectedDate.getHours() >= 12 ? 'PM' : 'AM'
    );

    // Refs for auto-focusing
    const hoursInputRef = useRef<HTMLInputElement>(null);
    const minutesInputRef = useRef<HTMLInputElement>(null);

    // Convert string inputs to numbers
    const hours = parseInt(hoursStr || '0', 10);

    // Determine if we should disable AM/PM toggle (for 24h time)
    const is24HourFormat = hours === 0 || hours > 12;

    // Focus minutes input when hours are complete
    const focusMinutes = () => {
        if (minutesInputRef.current) {
            minutesInputRef.current.focus();
        }
    };

    // Toggle AM/PM
    const toggleAmPm = (value: 'AM' | 'PM') => {
        if (is24HourFormat) return; // Do nothing if in 24h format
        setAmpm(value);
    };

    // Update time whenever hours, minutes, or ampm changes
    useEffect(() => {
        const newDate = new Date(selectedDate);

        // Safely parse inputs
        const h = parseInt(hoursStr || '0', 10);
        const m = parseInt(minutesStr || '0', 10);

        let hour24 = h;
        // Only apply AM/PM logic if we're in 12-hour format
        if (h <= 12 && h > 0) {
            // 12-hour format with AM/PM
            if (ampm === 'PM' && h < 12) hour24 = h + 12;
            if (ampm === 'AM' && h === 12) hour24 = 0;
        }

        newDate.setHours(hour24, m);
        onTimeSelected(newDate);
    }, [hoursStr, minutesStr, ampm, onTimeSelected]);

    return (
        <div className="p-6 flex items-center justify-center">
            <div className="flex items-center justify-center py-4">
                <div className="flex items-center">
                    <TimeInput
                        value={hoursStr}
                        maxValue={23}
                        onChangeText={setHoursStr}
                        onComplete={focusMinutes}
                        inputRef={hoursInputRef}
                    />

                    <span className="text-on-surface text-2xl">:</span>

                    <TimeInput
                        value={minutesStr}
                        maxValue={59}
                        onChangeText={setMinutesStr}
                        inputRef={minutesInputRef}
                    />
                </div>

                <div className="flex ml-4">
                    <button
                        onClick={() => toggleAmPm('AM')}
                        disabled={is24HourFormat}
                        className={`px-3 py-2 rounded-l-md 
                            ${ampm === 'AM' ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface border border-outline'}
                            ${is24HourFormat ? 'opacity-40 cursor-not-allowed' : ampm === 'AM' ? 'cursor-default' : 'hover:bg-opacity-90 cursor-pointer'}`}
                    >
                        AM
                    </button>

                    <button
                        onClick={() => toggleAmPm('PM')}
                        disabled={is24HourFormat}
                        className={`px-3 py-2 rounded-r-md 
                            ${ampm === 'PM' ? 'bg-primary text-on-primary' : 'bg-surface text-on-surface border border-outline'}
                            ${is24HourFormat ? 'opacity-40 cursor-not-allowed' : ampm === 'PM' ? 'cursor-default' : 'hover:bg-opacity-90 cursor-pointer'}`}
                    >
                        PM
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WebTimePicker;
