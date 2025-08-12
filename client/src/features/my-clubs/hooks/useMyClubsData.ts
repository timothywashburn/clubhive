import { ApiResponseBody, GetMyClubsResponse, isSuccess, UserClubData } from '@clubhive/shared';
import { useState, useEffect } from 'react';
import { MembershipData } from '../types';
import { useToast } from '../../../hooks/useToast';

export const useMyClubsData = () => {
    const [clubs, setClubs] = useState<UserClubData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
                setError(errorMessage);
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

    const getMembershipData = (club: UserClubData): MembershipData => {
        const joinDates = {
            '1': 'September 15, 2023',
            '2': 'January 10, 2024',
            '3': 'August 5, 2023',
            '4': 'November 20, 2023',
            '5': 'October 8, 2023',
            '6': 'February 14, 2024',
            '7': 'December 3, 2023',
            '8': 'March 22, 2024',
        };

        const eventsAttended = {
            '1': 12,
            '2': 3,
            '3': 8,
            '4': 15,
            '5': 6,
            '6': 4,
            '7': 9,
            '8': 2,
        };

        return {
            joinDate: joinDates[club._id as keyof typeof joinDates] || 'January 1, 2024',
            eventsAttended: eventsAttended[club._id as keyof typeof eventsAttended] || 0,
            totalEvents: eventsAttended[club._id as keyof typeof eventsAttended]
                ? eventsAttended[club._id as keyof typeof eventsAttended] + Math.floor(Math.random() * 5)
                : 5,
        };
    };

    return {
        clubs,
        loading,
        error,
        getClubColors,
        getMembershipData,
    };
};
