import { useEffect, useState, useCallback } from 'react';
import { SchoolWithCountsData } from '@clubhive/shared';

const getAuthHeaders = () => ({
    Authorization: 'Bearer temp',
    'Content-Type': 'application/json',
});

export const useSchoolData = () => {
    const [schools, setSchools] = useState<SchoolWithCountsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSchools = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetch('/api/schools', {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.success) {
                setSchools(data.schools);
            } else {
                setError(data.error?.message || 'Unknown error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);

    const refetch = useCallback(() => {
        fetchSchools(true);
    }, [fetchSchools]);

    return { schools, isLoading, error, refetch, isRefreshing };
};
