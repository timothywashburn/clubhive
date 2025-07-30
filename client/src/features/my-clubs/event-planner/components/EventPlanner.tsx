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
    viewMode?: 'calendar' | 'agenda';
    onViewModeChange?: (mode: 'calendar' | 'agenda') => void;
}

export function EventPlanner({ events, onUpdateEvent, selectedClub, onEventSelect, viewMode = 'calendar', onViewModeChange }: EventPlannerProps) {

    const handleEventClick = (event: EventData, eventElement?: HTMLElement) => {
        if (onEventSelect) {
            onEventSelect(event, eventElement);
        }
    };

    return (
        <div>
            {viewMode === 'calendar' ? (
                <CalendarView events={events} onUpdateEvent={onUpdateEvent} onEditEvent={handleEventClick} onViewModeChange={onViewModeChange} />
            ) : (
                <AgendaView events={events} onEditEvent={handleEventClick} onViewModeChange={onViewModeChange} />
            )}
        </div>
    );
}
