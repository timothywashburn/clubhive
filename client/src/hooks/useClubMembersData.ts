import { useState, useEffect } from 'react';
import { UserDoc } from '../../../server/src/models/user-schema';
import { ClubRole } from '@clubhive/shared';
import { useToast } from './useToast';

export const useClubMembersData = (clubId: string | undefined) => {
    const [members, setMembers] = useState<{ user: UserDoc; role: ClubRole }[]>([]);
    const [loading, setLoading] = useState(true);
    const { errorToast } = useToast();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                if (!clubId || clubId === 'undefined') {
                    setMembers([]);
                    setLoading(false);
                    return;
                }
                const response = await fetch(`/api/clubs/${clubId}/members`);
                const data = await response.json();

                if (data.success) {
                    setMembers(data.members);
                } else {
                    errorToast(`Failed to load club members: ${data.error?.message || 'Unknown error'}`);
                }
            } catch (error) {
                errorToast(`Failed to load club members: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [clubId]);

    return { members, loading };
};
