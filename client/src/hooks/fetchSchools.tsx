import { useEffect, useState, useCallback } from 'react';
import { SchoolWithCountsData } from '@clubhive/shared';
import { useToast } from './useToast';

const getAuthHeaders = () => ({
    Authorization: 'Bearer temp',
    'Content-Type': 'application/json',
});

export const useSchoolData = () => {
    const [schools, setSchools] = useState<SchoolWithCountsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

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
                const errorMessage = data.error?.message || 'Unknown error';
                setError(errorMessage);
                errorToast(`Failed to load schools: ${errorMessage}`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            errorToast(`Failed to load schools: ${errorMessage}`);
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
