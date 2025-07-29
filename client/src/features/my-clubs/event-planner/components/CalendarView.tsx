import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventData } from '@clubhive/shared';

interface CalendarViewProps {
    events: EventData[];
    onUpdateEvent?: (event: EventData) => void;
    onEditEvent?: (event: EventData, eventElement?: HTMLElement) => void;
    onViewModeChange?: (mode: 'calendar' | 'agenda') => void;
}

export function CalendarView({ events, onUpdateEvent, onEditEvent, onViewModeChange }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getEventsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
        return events.filter(event => event.date === dateStr);
    };

    const getCalendarDays = () => {
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const currentDate = new Date(startDate);

        // Calculate how many weeks we need
        const weeksNeeded = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7);
        const totalDays = weeksNeeded * 7;

        for (let i = 0; i < totalDays; i++) {
            const dayEvents = getEventsForDate(currentDate);
            days.push({
                date: new Date(currentDate),
                isCurrentMonth: currentDate.getMonth() === currentMonth.getMonth(),
                isToday: currentDate.toDateString() === new Date().toDateString(),
                events: dayEvents,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };

    const jumpToToday = () => {
        const today = new Date();
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    const handleEventClick = (event: EventData, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onEditEvent) {
            onEditEvent(event, e.currentTarget as HTMLElement);
        }
    };

    const calendarDays = getCalendarDays();
    const monthYear = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    // Get events for current month
    const currentMonthEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === currentMonth.getMonth() && eventDate.getFullYear() === currentMonth.getFullYear();
    });

    return (
        <div className="w-full space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={jumpToToday}
                            className="px-3 py-1 text-sm bg-primary text-on-primary rounded-md hover:bg-primary hover:opacity-90 cursor-pointer mr-4"
                        >
                            Today
                        </button>
                        <div className="flex items-center mr-4">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 hover:bg-surface-variant rounded-md cursor-pointer"
                            >
                                <ChevronLeft className="h-5 w-5 text-on-surface" />
                            </button>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="p-2 hover:bg-surface-variant rounded-md cursor-pointer"
                            >
                                <ChevronRight className="h-5 w-5 text-on-surface" />
                            </button>
                        </div>
                        <h3 className="text-xl font-semibold text-on-surface mr-3">{monthYear}</h3>
                    </div>
                    <div className="flex bg-surface-variant rounded-md p-1">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer bg-primary text-on-primary">
                            <Calendar className="h-4 w-4" />
                            Calendar
                        </button>
                        <button
                            onClick={() => onViewModeChange?.('agenda')}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface"
                        >
                            <List className="h-4 w-4" />
                            Table
                        </button>
                    </div>
                </div>
            </div>

            <motion.div 
                className="bg-surface rounded-lg shadow p-6 border border-outline-variant"
                initial={{ y: 20, scale: 0.98 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ 
                    y: { duration: 0.3, delay: 0 },
                    scale: { duration: 0.3, delay: 0.1 }
                }}
            >
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-on-surface-variant">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-0 border border-outline-variant border-opacity-30 rounded-lg overflow-hidden">
                    {calendarDays.map((day, index) => {
                        const isFirstRow = index < 7;
                        const isLastRow = index >= calendarDays.length - 7;
                        const isFirstCol = index % 7 === 0;
                        const isLastCol = index % 7 === 6;

                        let roundingClasses = '';
                        if (isFirstRow && isFirstCol) roundingClasses = 'rounded-tl-lg';
                        else if (isFirstRow && isLastCol) roundingClasses = 'rounded-tr-lg';
                        else if (isLastRow && isFirstCol) roundingClasses = 'rounded-bl-lg';
                        else if (isLastRow && isLastCol) roundingClasses = 'rounded-br-lg';

                        // Calculate dynamic height: base height + extra height for events beyond 2
                        const baseHeight = 80; // Accommodate 2 events
                        const extraEventsHeight = Math.max(0, day.events.length - 2) * 20; // 20px per extra event
                        const cellHeight = baseHeight + extraEventsHeight;

                        const cellClasses = [
                            'p-2 transition-colors flex flex-col border-r border-b border-outline-variant border-opacity-30 last:border-r-0 hover:bg-surface-variant',
                            roundingClasses,
                            day.isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant opacity-50',
                        ].join(' ');

                        return (
                            <div key={index} style={{ minHeight: `${cellHeight}px` }} className={cellClasses}>
                                <div
                                    className={`text-sm font-medium mb-1 text-center ${day.isToday ? 'bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}
                                >
                                    {day.date.getDate()}
                                </div>
                                {day.events.length > 0 && (
                                    <div className="space-y-1 flex-1">
                                        <AnimatePresence>
                                            {day.events.map(event => (
                                                <motion.button
                                                    key={event._id}
                                                    layoutId={`event-${event._id}`}
                                                    onClick={e => handleEventClick(event, e)}
                                                    className="w-full text-xs bg-primary text-on-primary px-1 py-0.5 rounded truncate cursor-pointer"
                                                >
                                                    {event.name}
                                                </motion.button>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
