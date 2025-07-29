import { useState } from 'react';
import { Calendar, List } from 'lucide-react';
import { EventData } from '@clubhive/shared';
import { CalendarView } from './CalendarView';
import { AgendaView } from './AgendaView';

interface EventPlannerProps {
    events: EventData[];
    onUpdateEvent?: (event: EventData) => void;
    selectedClub?: { name: string };
    onEventSelect?: (event: EventData | null) => void;
}

type ViewMode = 'calendar' | 'agenda';

export function EventPlanner({ events, onUpdateEvent, selectedClub, onEventSelect }: EventPlannerProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');

    const handleEventClick = (event: EventData) => {
        if (onEventSelect) {
            onEventSelect(event);
        }
    };

    return (
        <div>
            {viewMode === 'calendar' ? (
                <CalendarView events={events} onUpdateEvent={onUpdateEvent} onEditEvent={handleEventClick} onViewModeChange={setViewMode} />
            ) : (
                <AgendaView events={events} onEditEvent={onUpdateEvent} onViewModeChange={setViewMode} />
            )}
        </div>
    );
}
