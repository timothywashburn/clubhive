import { UpdateClubRequest } from '@clubhive/shared';

export const updateClub = async (clubId: string, updates: UpdateClubRequest) => {
    const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include',
    });

    const data = await response.json();
    if (!data.success) {
        // Commented this out since const data already exists
        //    const errorText = await response.text();
        console.log('Response status:', response.status);
        throw new Error(data.error?.message || 'Update failed');
    }

    return data.club;
};
