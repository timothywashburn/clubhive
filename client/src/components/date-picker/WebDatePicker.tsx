import React from 'react';

interface DatePickerProps {
    selectedDate: Date;
    onDateSelected: (date: Date) => void;
}

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

const WebDatePicker: React.FC<DatePickerProps> = ({
    selectedDate,
    onDateSelected,
}) => {
    const [currentMonth, setCurrentMonth] = React.useState(
        selectedDate.getMonth()
    );
    const [currentYear, setCurrentYear] = React.useState(
        selectedDate.getFullYear()
    );

    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prevYear => prevYear - 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prevYear => prevYear + 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth + 1);
        }
    };

    const selectDay = (day: number | null) => {
        if (day === null) return;

        const newDate = new Date(selectedDate);
        newDate.setFullYear(currentYear);
        newDate.setMonth(currentMonth);
        newDate.setDate(day);
        onDateSelected(newDate);
    };

    const isToday = (day: number | null) => {
        if (day === null) return false;

        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const isSelected = (day: number | null) => {
        if (day === null) return false;

        return (
            day === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
        );
    };

    const generateCalendarWeeks = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

        const weeks = [];
        let week = [];

        for (let i = 0; i < firstDay; i++) week.push(null);

        for (let day = 1; day <= daysInMonth; day++) {
            week.push(day);

            if (week.length === 7) {
                weeks.push([...week]);
                week = [];
            }
        }

        if (week.length > 0) {
            while (week.length < 7) week.push(null);
            weeks.push(week);
        }

        return weeks;
    };

    const weeks = generateCalendarWeeks();

    return (
        <div className="p-4">
            {/* Month and year navigation */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={goToPrevMonth}
                    className="p-2 hover:bg-surface-variant rounded-md cursor-pointer"
                >
                    <span className="text-primary font-bold">←</span>
                </button>

                <span className="text-on-surface font-bold">
                    {MONTHS[currentMonth]} {currentYear}
                </span>

                <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-surface-variant rounded-md cursor-pointer"
                >
                    <span className="text-primary font-bold">→</span>
                </button>
            </div>

            {/* Day headers */}
            <div className="flex mb-2">
                {DAYS.map((day, index) => (
                    <div
                        key={index}
                        className="flex-1 flex items-center justify-center"
                    >
                        <span className="text-on-surface-variant font-medium text-sm">
                            {day}
                        </span>
                    </div>
                ))}
            </div>

            {/* Calendar grid with proper table layout */}
            {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex h-10">
                    {week.map((day: number | null, dayIndex) => (
                        <button
                            key={dayIndex}
                            onClick={() => selectDay(day)}
                            className={`flex-1 flex items-center justify-center disabled:cursor-default ${isSelected(day) ? 'cursor-default' : 'cursor-pointer'}`}
                            disabled={day === null}
                        >
                            <div
                                className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors
                                ${isSelected(day) ? 'bg-primary' : isToday(day) ? 'bg-primary-container' : 'hover:bg-surface-variant'}`}
                            >
                                <span
                                    className={`
                                    ${isSelected(day) ? 'text-on-primary' : isToday(day) ? 'text-on-primary-container' : 'text-on-surface'}
                                    ${day === null ? 'opacity-0' : ''}
                                `}
                                >
                                    {day || ' '}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default WebDatePicker;
