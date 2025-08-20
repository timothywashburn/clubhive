import { UserClubData } from '@clubhive/shared';

interface SaveClubChangesParams {
    clubId: string;
    formData: UserClubData;
}

export async function saveClubChanges({ clubId, formData }: SaveClubChangesParams) {
    try {
        const tagsToSave = formData.tags.filter(tag => !tag._id.startsWith('temp-id-')).map(tag => tag._id);

        const newTags = formData.tags.filter(tag => tag._id.startsWith('temp-id-')).map(tag => tag.text);

        let newTagIds: string[] = [];
        if (newTags.length > 0) {
            const res = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ names: newTags }),
            });
            if (!res.ok) throw new Error('Failed to create new tags');
            newTagIds = await res.json();
        }

        const updatedData = {
            ...formData,
            tags: [...tagsToSave, ...newTagIds],
        };

        const response = await fetch(`/api/clubs/${clubId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Failed to update club');

        return await response.json();
    } catch (error) {
        console.error('Error saving club changes:', error);
        throw error;
    }
}
