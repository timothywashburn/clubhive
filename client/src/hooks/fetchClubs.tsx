import { useEffect, useState } from 'react';
import { ClubData } from '@clubhive/shared';

export const useClubData = () => {
    const [clubs, setClubs] = useState<ClubData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/clubs', {
            headers: {
                Authorization: `Bearer temp`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setClubs(data.data.clubs);
                } else {
                    setError(data.error?.message || 'Unknown error');
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return { clubs, isLoading, error };
};
