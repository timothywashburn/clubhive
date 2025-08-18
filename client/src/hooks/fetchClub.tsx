import { useEffect, useState, useCallback } from 'react';
import { ClubData } from '@clubhive/shared';
import { useToast } from './useToast';

const getRequestOptions = () => ({
    credentials: 'include' as RequestCredentials,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useClubData = (clubId: string) => {
    const [club, setClub] = useState<ClubData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    const fetchClub = useCallback(
        async (isRefresh = false) => {
            if (!clubId) return;

            if (isRefresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            try {
                const response = await fetch(`/api/clubs/${clubId}`, getRequestOptions());
                const data = await response.json();

                if (data.success) {
                    setClub(data.club);
                } else {
                    const errorMessage = data.error?.message || 'Unknown error';
                    setError(errorMessage);
                    errorToast(`Failed to load club: ${errorMessage}`);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                errorToast(`Failed to load club: ${errorMessage}`);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [clubId]
    );

    useEffect(() => {
        fetchClub();
    }, [fetchClub]);

    const refetch = useCallback(() => {
        fetchClub(true);
    }, [fetchClub]);

    return { club, isLoading, error, refetch, isRefreshing };
};
