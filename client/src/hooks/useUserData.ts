import { useEffect, useState, useCallback } from 'react';
import { UserWithCountsData } from '@clubhive/shared';
import { useToast } from './useToast';

const getRequestOptions = () => ({
    credentials: 'include' as RequestCredentials,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const useUserData = () => {
    const [users, setUsers] = useState<UserWithCountsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    const fetchUsers = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const response = await fetch('/api/users', getRequestOptions());
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
            } else {
                const errorMessage = data.error?.message || 'Unknown error';
                setError(errorMessage);
                errorToast(`Failed to load users: ${errorMessage}`);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            errorToast(`Failed to load users: ${errorMessage}`);
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
