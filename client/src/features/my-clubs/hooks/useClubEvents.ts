import { useState, useEffect } from 'react';
import { ApiErrorResponse, ApiResponseBody, EventData, GetEventsResponse, isSuccess } from '@clubhive/shared';

export const useClubEvents = (clubId: string | null) => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!clubId) {
            setEvents([]);
            setLoading(false);
            setError(null);
            return;
        }

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/events?clubId=${clubId}`, {
                    headers: {
                        Authorization: 'Bearer temp',
                    },
                });

                const data: ApiResponseBody<GetEventsResponse> = await response.json();

                if (isSuccess(data)) {
                    setEvents(data.events);
                } else {
                    throw new Error(data.error?.message || 'Failed to fetch events');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [clubId]);

    return { events, loading, error };
};
