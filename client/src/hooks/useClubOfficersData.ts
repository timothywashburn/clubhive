import { useState, useEffect } from 'react';
import { ClubRole } from '@clubhive/shared';
import { useToast } from './useToast';

interface ClubOfficer {
    role: ClubRole;
    name: string;
}

export const useClubOfficersData = (clubId: string | undefined) => {
    const [officers, setOfficers] = useState<ClubOfficer[]>([]);
    const [loading, setLoading] = useState(true);
    const { errorToast } = useToast();

    useEffect(() => {
        const fetchOfficers = async () => {
            try {
                if (!clubId || clubId === 'undefined') {
                    setOfficers([]);
                    setLoading(false);
                    return;
                }

                const response = await fetch(`/api/clubs/${clubId}/officers`);
                const data = await response.json();

                if (data.success) {
                    setOfficers(data.officers);
                } else {
                    errorToast(`Failed to load club officers: ${data.error?.message || 'Unknown error'}`);
                }
            } catch (error) {
                errorToast(`Failed to load club officers: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchOfficers();
    }, [clubId]);

    return { officers, loading };
};
