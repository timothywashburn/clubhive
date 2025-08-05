import { useEffect, useState, useCallback } from 'react';
import { UserWithCountsData } from '@clubhive/shared';

const getAuthHeaders = () => ({
    Authorization: 'Bearer temp',
    'Content-Type': 'application/json',
});

export const useUserData = () => {
    const [users, setUsers] = useState<UserWithCountsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetch('/api/users', {
                headers: getAuthHeaders(),
            });
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
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
        fetchUsers();
    }, [fetchUsers]);

    const refetch = useCallback(() => {
        fetchUsers(true);
    }, [fetchUsers]);

    return { users, isLoading, error, refetch, isRefreshing };
};
