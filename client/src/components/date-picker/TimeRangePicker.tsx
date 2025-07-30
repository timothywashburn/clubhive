import React, { useState, useRef, useEffect } from 'react';

interface TimeRangePickerProps {
    startTime?: Date;
    endTime?: Date;
    onStartTimeChange: (time: Date) => void;
    onEndTimeChange: (time: Date) => void;
    onDismiss: () => void;
    onDone?: (startTime: Date, endTime: Date) => void;
}

interface TimeInputProps {
    value: string;
    maxValue: number;
    onChangeText: (text: string) => void;
    onComplete?: () => void;
    placeholder?: string;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, maxValue, onChangeText, onComplete, placeholder = '00', inputRef }) => {
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
            className="bg-surface text-on-surface w-10 h-10 text-center text-lg border-b-2 border-outline focus:border-primary mx-1 focus:outline-none"
        />
    );
};

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ startTime, endTime, onStartTimeChange, onEndTimeChange, onDismiss, onDone }) => {
    // Default to 9 AM - 5 PM if no times provided
    const defaultStart =
        startTime ||
        (() => {
            const date = new Date();
            date.setHours(9, 0, 0, 0);
            return date;
        })();

    const defaultEnd =
        endTime ||
        (() => {
            const date = new Date();
            date.setHours(17, 0, 0, 0);
            return date;
        })();

    // Convert 24h time to 12h format for display
    const to12HourFormat = (hours24: number) => {
        if (hours24 === 0) return 12;
        if (hours24 > 12) return hours24 - 12;
        return hours24;
    };

    // Start time state
    const [startHoursStr, setStartHoursStr] = useState(to12HourFormat(defaultStart.getHours()).toString());
    const [startMinutesStr, setStartMinutesStr] = useState(defaultStart.getMinutes().toString().padStart(2, '0'));
    const [startAmpm, setStartAmpm] = useState(defaultStart.getHours() >= 12 ? 'PM' : 'AM');

    // End time state
    const [endHoursStr, setEndHoursStr] = useState(to12HourFormat(defaultEnd.getHours()).toString());
    const [endMinutesStr, setEndMinutesStr] = useState(defaultEnd.getMinutes().toString().padStart(2, '0'));
    const [endAmpm, setEndAmpm] = useState(defaultEnd.getHours() >= 12 ? 'PM' : 'AM');

    // Refs for auto-focusing
    const startHoursRef = useRef<HTMLInputElement>(null);
    const startMinutesRef = useRef<HTMLInputElement>(null);
    const endHoursRef = useRef<HTMLInputElement>(null);
    const endMinutesRef = useRef<HTMLInputElement>(null);

    // Focus helpers
    const focusStartMinutes = () => startMinutesRef.current?.focus();
    const focusEndHours = () => endHoursRef.current?.focus();
    const focusEndMinutes = () => endMinutesRef.current?.focus();

    // Create time from inputs
    const createTimeFromInputs = (hoursStr: string, minutesStr: string, ampm: string) => {
        const h = parseInt(hoursStr || '0', 10);
        const m = parseInt(minutesStr || '0', 10);

        let hour24 = h;
        if (h <= 12 && h > 0) {
            if (ampm === 'PM' && h < 12) hour24 = h + 12;
            if (ampm === 'AM' && h === 12) hour24 = 0;
        }

        const date = new Date();
        date.setHours(hour24, m, 0, 0);
        return date;
    };

    // Update start time
    useEffect(() => {
        const newStartTime = createTimeFromInputs(startHoursStr, startMinutesStr, startAmpm);
        onStartTimeChange(newStartTime);
    }, [startHoursStr, startMinutesStr, startAmpm, onStartTimeChange]);

    // Update end time
    useEffect(() => {
        const newEndTime = createTimeFromInputs(endHoursStr, endMinutesStr, endAmpm);
        onEndTimeChange(newEndTime);
    }, [endHoursStr, endMinutesStr, endAmpm, onEndTimeChange]);

    const handleDone = () => {
        const finalStartTime = createTimeFromInputs(startHoursStr, startMinutesStr, startAmpm);
        const finalEndTime = createTimeFromInputs(endHoursStr, endMinutesStr, endAmpm);

        if (onDone) {
            onDone(finalStartTime, finalEndTime);
        } else {
            onDismiss();
        }
    };

    return (
        <div className="bg-surface rounded-lg shadow-lg w-auto max-w-lg">
            {/* Header */}
            <div className="bg-primary-container p-4 rounded-t-lg">
                <div className="text-on-primary-container text-center text-lg font-medium">Select Time Range</div>
            </div>

            {/* Time Inputs */}
            <div className="p-6 space-y-6">
                {/* Start Time */}
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-3">Start Time</label>
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            <TimeInput
                                value={startHoursStr}
                                maxValue={12}
                                onChangeText={setStartHoursStr}
                                onComplete={focusStartMinutes}
                                inputRef={startHoursRef}
                            />
                            <span className="text-on-surface text-xl">:</span>
                            <TimeInput
                                value={startMinutesStr}
                                maxValue={59}
                                onChangeText={setStartMinutesStr}
                                onComplete={focusEndHours}
                                inputRef={startMinutesRef}
                            />
                        </div>
                        <div className="flex ml-4">
                            <button
                                onClick={() => setStartAmpm('AM')}
                                className={`px-3 py-2 rounded-l-md text-sm ${
                                    startAmpm === 'AM'
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface text-on-surface border border-outline hover:bg-surface-variant/50'
                                }`}
                            >
                                AM
                            </button>
                            <button
                                onClick={() => setStartAmpm('PM')}
                                className={`px-3 py-2 rounded-r-md text-sm ${
                                    startAmpm === 'PM'
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface text-on-surface border border-outline hover:bg-surface-variant/50'
                                }`}
                            >
                                PM
                            </button>
                        </div>
                    </div>
                </div>

                {/* End Time */}
                <div>
                    <label className="block text-sm font-medium text-on-surface mb-3">End Time</label>
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            <TimeInput
                                value={endHoursStr}
                                maxValue={12}
                                onChangeText={setEndHoursStr}
                                onComplete={focusEndMinutes}
                                inputRef={endHoursRef}
                            />
                            <span className="text-on-surface text-xl">:</span>
                            <TimeInput value={endMinutesStr} maxValue={59} onChangeText={setEndMinutesStr} inputRef={endMinutesRef} />
                        </div>
                        <div className="flex ml-4">
                            <button
                                onClick={() => setEndAmpm('AM')}
                                className={`px-3 py-2 rounded-l-md text-sm ${
                                    endAmpm === 'AM'
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface text-on-surface border border-outline hover:bg-surface-variant/50'
                                }`}
                            >
                                AM
                            </button>
                            <button
                                onClick={() => setEndAmpm('PM')}
                                className={`px-3 py-2 rounded-r-md text-sm ${
                                    endAmpm === 'PM'
                                        ? 'bg-primary text-on-primary'
                                        : 'bg-surface text-on-surface border border-outline hover:bg-surface-variant/50'
                                }`}
                            >
                                PM
                            </button>
                        </div>
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

export default TimeRangePicker;
