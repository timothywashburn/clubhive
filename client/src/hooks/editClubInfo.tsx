import { useState, useRef } from 'react';
import { updateClub } from '../utils/updateClub';
import { UpdateClubRequest } from '@clubhive/shared';
import { ClubStatus } from '@clubhive/shared';

export const editClubInfo = (initialData, clubId, resetTagsCallback) => {
    const defaultData = {
        name: '',
        tagline: '',
        description: '',
        url: '',
        status: '',
        joinRequirements: '',
        socials: { website: '', discord: '', instagram: '' },
        tags: [],
        clubLogo: '',
        pictures: [],
    };

    const hasRealData = data => {
        return data && (data.name?.trim() || data.tagline?.trim() || data.description?.trim() || data.url?.trim());
    };

    const normalizeSocialsFromBackend = (socials: { discord?: string; instagram?: string; website?: string } = {}) => {
        return {
            discord: socials.discord?.replace('https://discord.gg/', '')?.replace('https://discord.com/invite/', ''),
            instagram: socials.instagram?.replace('https://www.instagram.com/', '')?.replace('https://instagram.com/', '') || '',
            website: socials.website?.replace('https://', '') || '',
        };
    };

    const [formData, setFormData] = useState(() => {
        if (hasRealData(initialData)) {
            return {
                ...initialData,
                socials: normalizeSocialsFromBackend(initialData.socials),
            };
        }
        return defaultData;
    });

    const [savedInitialData, setSavedInitialData] = useState(() => {
        if (hasRealData(initialData)) {
            return {
                ...initialData,
                socials: normalizeSocialsFromBackend(initialData.socials),
            };
        }
        return null;
    });

    const prevInitialData = useRef(null);

    if (hasRealData(initialData) && !hasRealData(prevInitialData.current)) {
        setFormData({
            ...initialData,
            socials: normalizeSocialsFromBackend(initialData.socials),
        });
        setSavedInitialData({
            ...initialData,
            socials: normalizeSocialsFromBackend(initialData.socials),
        });
        prevInitialData.current = initialData;
    }

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSocialsChange = e => {
        const { name, value } = e.target;

        let processedValue = value;
        if (name === 'discord') {
            processedValue = value.replace('https://discord.gg/', '').replace('https://discord.com/invite/', '');
        } else if (name === 'instagram') {
            processedValue = value.replace('https://www.instagram.com/', '').replace('https://instagram.com/', '');
        } else if (name === 'website') {
            processedValue = value.replace('https://', '');
        }

        setFormData(prevData => ({
            ...prevData,
            socials: {
                ...prevData.socials,
                [name]: processedValue,
            },
        }));
    };

    const handleSaveChanges = async (tagsToSave = []) => {
        try {
            const normalizeUpdatePayload = (data: typeof formData) => {
                return {
                    name: data.name?.trim() || undefined,
                    tagline: data.tagline?.trim() || undefined,
                    description: data.description?.trim() || undefined,
                    url: data.url?.trim() || undefined,
                    joinRequirements: data.joinRequirements?.trim() || undefined,
                    status: data.status,
                    socials: {
                        discord: data.socials?.discord ? data.socials.discord.replace(/^https?:\/\//, '').trim() : undefined,
                        instagram: data.socials?.instagram ? data.socials.instagram.replace(/^https?:\/\//, '').trim() : undefined,
                        website: data.socials?.website ? data.socials.website.replace(/^https?:\/\//, '').trim() : undefined,
                    },
                    tags: tagsToSave.map(tag => tag._id).filter(Boolean) || undefined,
                    clubLogo: data.clubLogo || undefined,
                    pictures: data.pictures || undefined,
                };
            };

            const normalizedPayload = normalizeUpdatePayload(formData);

            console.log('Final payload being sent:', normalizedPayload);
            console.log('Tags being sent:', tagsToSave);

            const updatedClub = await updateClub(clubId, normalizedPayload);

            setFormData({
                ...updatedClub,
                socials: normalizeSocialsFromBackend(updatedClub.socials),
            });
            setSavedInitialData({
                ...updatedClub,
                socials: normalizeSocialsFromBackend(updatedClub.socials),
            });

            console.log('Update successfull:', updatedClub);
            alert('Your update was successfull!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error: Your updates were not saved.');
        }
    };

    const handleDiscardChanges = () => {
        if (savedInitialData) {
            setFormData({ ...savedInitialData });
        } else {
            setFormData(initialData);
        }
        if (resetTagsCallback) {
            resetTagsCallback();
        }
    };

    return {
        formData,
        handlers: {
            handleInputChange,
            handleSocialsChange,
            handleSaveChanges,
            handleDiscardChanges,
        },
    };
};
