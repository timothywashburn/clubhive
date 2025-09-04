import { ApiResponseBody, GetMyClubsResponse, isSuccess, UserClubData } from '@clubhive/shared';
import { useState, useEffect } from 'react';
import { MembershipData } from '../features/my-clubs/types';
import { useToast } from './useToast.ts';

export const useMyClubsData = () => {
    const [clubs, setClubs] = useState<UserClubData[]>([]);
    const [loading, setLoading] = useState(true);
    const { errorToast } = useToast();

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch('/api/me/clubs', {
                    credentials: 'include',
                });

                const data: ApiResponseBody<GetMyClubsResponse> = await response.json();
                if (isSuccess(data)) {
                    setClubs(data.clubs);
                } else {
                    throw new Error(data.error?.message || 'Failed to fetch clubs');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                errorToast(`Failed to fetch my clubs: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, []);

    const getClubColors = (clubId: string): string => {
        const colors = [
            'bg-blue-500 text-white',
            'bg-green-500 text-white',
            'bg-purple-500 text-white',
            'bg-red-500 text-white',
            'bg-yellow-500 text-black',
            'bg-pink-500 text-white',
            'bg-indigo-500 text-white',
            'bg-teal-500 text-white',
        ];
        const index = parseInt(clubId) % colors.length;
        return colors[index];
    };

    return {
        clubs,
        loading,
        getClubColors,
    };
};
