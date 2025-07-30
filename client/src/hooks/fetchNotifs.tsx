import { useState, useEffect } from 'react';
import { AnnouncementData } from '@clubhive/shared';

export const useNotifs = (userId: string) => {
    const [notifs, setNotifs] = useState<AnnouncementData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/notifications/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setNotifs(data.notifications);
                } else {
                    setError(data.error?.message || 'Unknown error');
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, [userId]);

    return { notifs, isLoading, error };
};
