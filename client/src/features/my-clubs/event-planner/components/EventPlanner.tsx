import { useState } from 'react';
import { Calendar, List } from 'lucide-react';
import { EventData } from '@clubhive/shared';
import { CalendarView } from './CalendarView';
import { AgendaView } from './AgendaView';

interface EventPlannerProps {
    events: EventData[];
    onUpdateEvent?: (event: EventData) => void;
    selectedClub?: { name: string };
    onEventSelect?: (event: EventData | null, eventElement?: HTMLElement) => void;
    onCreateEvent?: (selectedDate?: Date, sourceLayoutId?: string) => void;
    viewMode?: 'calendar' | 'agenda';
    onViewModeChange?: (mode: 'calendar' | 'agenda') => void;
}

export function EventPlanner({
    events,
    onUpdateEvent,
    selectedClub,
    onEventSelect,
    onCreateEvent,
    viewMode = 'calendar',
    onViewModeChange,
}: EventPlannerProps) {
    const handleEventClick = (event: EventData, eventElement?: HTMLElement) => {
        if (onEventSelect) {
            onEventSelect(event, eventElement);
        }
    };

    return (
        <div>
            {viewMode === 'calendar' ? (
                <CalendarView
                    events={events}
                    onUpdateEvent={onUpdateEvent}
                    onEditEvent={handleEventClick}
                    onCreateEvent={onCreateEvent}
                    onViewModeChange={onViewModeChange}
                />
            ) : (
                <AgendaView
                    events={events}
                    onEditEvent={handleEventClick}
                    onCreateEvent={onCreateEvent}
                    onViewModeChange={onViewModeChange}
                />
            )}
        </div>
    );
}
