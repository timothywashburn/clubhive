import { useState } from 'react';
import { Calendar, List } from 'lucide-react';
import { EventData } from '@clubhive/shared';
import { CalendarView } from './CalendarView';
import { AgendaView } from './AgendaView';

interface EventPlannerProps {
    events: EventData[];
    onUpdateEvent?: (event: EventData) => void;
}

type ViewMode = 'calendar' | 'agenda';

export function EventPlanner({ events, onUpdateEvent }: EventPlannerProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-on-surface">Events</h3>
                <div className="flex bg-surface-variant rounded-md p-1">
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                            ${viewMode === 'calendar' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}
                        `}
                    >
                        <Calendar className="h-4 w-4" />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode('agenda')}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                            ${viewMode === 'agenda' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}
                        `}
                    >
                        <List className="h-4 w-4" />
                        Agenda
                    </button>
                </div>
            </div>

            {viewMode === 'calendar' ? (
                <CalendarView events={events} onUpdateEvent={onUpdateEvent} />
            ) : (
                <AgendaView events={events} onEditEvent={onUpdateEvent} />
            )}
        </div>
    );
}
