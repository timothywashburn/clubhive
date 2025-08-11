import { useState, useEffect } from 'react';
import { NotifDisplayData } from '@clubhive/shared';
import { useToast } from './useToast';

export const useNotifs = (userId: string) => {
    const [notifs, setNotifs] = useState<NotifDisplayData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    useEffect(() => {
        fetch(`/api/notifications/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setNotifs(data.notifications as NotifDisplayData[]);
                } else {
                    const errorMessage = data.error?.message || 'Unknown error';
                    setError(errorMessage);
                    errorToast(`Failed to load notifications: ${errorMessage}`);
                }
            })
            .catch(err => {
                setError(err.message);
                errorToast(`Failed to load notifications: ${err.message}`);
            })
            .finally(() => setIsLoading(false));
    }, [userId]);

    return { notifs, setNotifs, isLoading, error };
};
