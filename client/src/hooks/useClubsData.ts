import { useEffect, useState, useCallback } from 'react';
import { ClubWithCountsData } from '@clubhive/shared';
import { useToast } from './useToast';

const getRequestOptions = () => ({
    credentials: 'include' as RequestCredentials,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useClubsData = () => {
    const [clubs, setClubs] = useState<ClubWithCountsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    const fetchClubs = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetch('/api/clubs', getRequestOptions());
            const data = await response.json();

            if (data.success) {
                setClubs(data.clubs);
            } else {
                const errorMessage = data.error?.message || 'Unknown error';
                setError(errorMessage);
                errorToast(`Failed to load clubs: ${errorMessage}`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            errorToast(`Failed to load clubs: ${errorMessage}`);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchClubs();
    }, [fetchClubs]);

    const refetch = useCallback(() => {
        fetchClubs(true);
    }, [fetchClubs]);

    return { clubs, isLoading, error, refetch, isRefreshing };
};
