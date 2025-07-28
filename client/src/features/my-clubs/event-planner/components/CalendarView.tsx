import { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { EventData } from '@clubhive/shared';
import { EventModal } from './EventModal';

interface CalendarViewProps {
    events: EventData[];
    onUpdateEvent?: (event: EventData) => void;
}

export function CalendarView({ events, onUpdateEvent }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const formatSelectedDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const jumpToToday = () => {
        const today = new Date();
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setSelectedDate(today);
    };

    const handleEditEvent = (event: EventData) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEvent = (updatedEvent: EventData) => {
        if (onUpdateEvent) {
            onUpdateEvent(updatedEvent);
        }
        setEditingEvent(null);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setEditingEvent(null);
        setIsModalOpen(false);
    };

    const handleCreateEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const calendarDays = getCalendarDays();
    const monthYear = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="flex gap-6 items-start">
            <div className="flex-1">
                <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant h-[586px]">
                    <div className="flex items-center mb-6">
                        <button
                            onClick={jumpToToday}
                            className="px-3 py-1 text-sm bg-primary text-on-primary rounded-md hover:bg-primary/90 cursor-pointer mr-4"
                        >
                            Today
                        </button>
                        <div className="flex items-center">
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
                        <h3 className="text-xl font-semibold text-on-surface ml-4">{monthYear}</h3>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-center text-sm font-medium text-on-surface-variant">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0 border border-outline-variant/30 rounded-lg overflow-hidden">
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

                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (!day.isCurrentMonth) {
                                            setCurrentMonth(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
                                        }
                                        setSelectedDate(day.date);
                                    }}
                                    className={`
                                        min-h-[80px] p-2 transition-colors cursor-pointer flex flex-col border-r border-b border-outline-variant/30 last:border-r-0 hover:bg-surface-variant ${roundingClasses}
                                        ${day.isCurrentMonth ? 'text-on-surface' : 'text-on-surface-variant/50'}
                                        ${selectedDate.toDateString() === day.date.toDateString() ? 'bg-primary/20' : ''}
                                    `}
                                >
                                    <div
                                        className={`
                                        text-sm font-medium mb-1 text-center
                                        ${
                                            day.isToday
                                                ? 'bg-primary text-on-primary rounded-full w-6 h-6 flex items-center justify-center mx-auto'
                                                : ''
                                        }
                                    `}
                                    >
                                        {day.date.getDate()}
                                    </div>
                                    {day.events.length > 0 && (
                                        <div className="space-y-1">
                                            {day.events.slice(0, 2).map(event => (
                                                <div
                                                    key={event._id}
                                                    className="text-xs bg-primary/80 text-on-primary px-1 py-0.5 rounded truncate"
                                                >
                                                    {event.name}
                                                </div>
                                            ))}
                                            {day.events.length > 2 && (
                                                <div className="text-xs text-on-surface-variant truncate">
                                                    +{day.events.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-80">
                <div className="bg-surface rounded-lg shadow border border-outline-variant flex flex-col h-[586px]">
                    <div className="p-6 border-b border-outline-variant">
                        <h4 className="text-lg font-semibold text-on-surface">{formatSelectedDate(selectedDate)}</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-surface">
                        {getEventsForDate(selectedDate).length > 0 ? (
                            <div className="space-y-3">
                                {getEventsForDate(selectedDate).map(event => (
                                    <div
                                        key={event._id}
                                        onClick={() => handleEditEvent(event)}
                                        className="border border-outline-variant rounded-md p-3 cursor-pointer hover:bg-surface-variant transition-colors group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-medium text-on-surface mb-1 truncate">{event.name}</h5>
                                                <p className="text-sm text-on-surface-variant mb-1">
                                                    {event.startTime} - {event.endTime}
                                                </p>
                                                <p className="text-sm text-on-surface-variant truncate">{event.location}</p>
                                            </div>
                                            <Edit3 className="h-4 w-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-outline-variant/50">
                                            <p className="text-xs text-on-surface-variant text-center">Click to edit event details</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-on-surface-variant">No events scheduled for this day.</p>
                        )}
                    </div>
                    <div className="p-6 border-t border-outline-variant">
                        <button
                            onClick={handleCreateEvent}
                            className="w-full bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium cursor-pointer transition-colors"
                        >
                            Create Event for{' '}
                            {selectedDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </button>
                    </div>
                </div>
            </div>

            <EventModal
                event={editingEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveEvent}
                selectedDate={selectedDate}
            />
        </div>
    );
}
