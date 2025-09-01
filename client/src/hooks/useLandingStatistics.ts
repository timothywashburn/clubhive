import { useState, useEffect } from 'react';
import { useToast } from './useToast';

interface LandingStatistics {
    users: number;
    clubs: number;
    events: number;
    schools: number;
}

interface UseLandingStatisticsReturn {
    data: LandingStatistics | null;
    loading: boolean;
}

export function useLandingStatistics(): UseLandingStatisticsReturn {
    const [data, setData] = useState<LandingStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const { errorToast } = useToast();

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);

                const response = await fetch('/api/landing-statistics');

                if (!response.ok) {
                    throw new Error(`Failed to fetch statistics: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    setData({
                        users: result.users,
                        clubs: result.clubs,
                        events: result.events,
                        schools: result.schools,
                    });
                } else {
                    throw new Error(result.error?.message || 'Failed to fetch statistics');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                errorToast(`Failed to load statistics: ${errorMessage}`);
                console.error('Error fetching landing statistics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    return { data, loading };
}
