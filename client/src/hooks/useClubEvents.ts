import { useState, useEffect } from 'react';
import { ApiErrorResponse, ApiResponseBody, EventData, GetEventsResponse, isSuccess } from '@clubhive/shared';
import { useToast } from './useToast.ts';

export const useClubEvents = (clubId: string | null) => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    const fetchEvents = async () => {
        if (!clubId) {
            setEvents([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/events?clubId=${clubId}`, {
                credentials: 'include',
            });

            const data: ApiResponseBody<GetEventsResponse> = await response.json();

            if (isSuccess(data)) {
                setEvents(data.events);
            } else {
                throw new Error(data.error?.message || 'Failed to fetch events');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            errorToast(`Failed to fetch events: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [clubId]);

    return { events, loading, error, refetch: fetchEvents };
};
