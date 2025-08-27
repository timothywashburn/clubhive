import { useState, useEffect } from 'react';
import { ClubWithEventsData, clubWithEventsAndCountsSchema } from '@clubhive/shared';
import { useToast } from './useToast';

export function useClubByUrl(url: string | undefined) {
    const [club, setClub] = useState<ClubWithEventsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        fetch(`/api/clubs/by-url/${url}`)
            .then(res => res.json())
            .then(data => {
                console.log('Fetch result:', data);

                if (data.success) {
                    const parsed = clubWithEventsAndCountsSchema.parse(data.club);
                    setClub(parsed);
                    console.log('Club data loaded:', data);
                } else {
                    const errorMessage = data.error?.message || 'Unknown error';
                    setError(errorMessage);
                    errorToast(`Failed to load club: ${errorMessage}`);
                }
            })
            .catch(err => {
                const errorMessage = `Failed to load club: ${err.message}`;
                setError(errorMessage);
                errorToast(errorMessage);
            })
            .finally(() => setLoading(false));
    }, [url]);

    return { club, loading, error };
}