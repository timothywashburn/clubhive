import { useState, useEffect, useRef } from 'react';
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

    const [formData, setFormData] = useState(() => {
        return hasRealData(initialData) ? initialData : defaultData;
    });

    const [savedInitialData, setSavedInitialData] = useState(() => {
        return hasRealData(initialData) ? { ...initialData } : null;
    });

    const prevInitialData = useRef(null);

    if (hasRealData(initialData) && !hasRealData(prevInitialData.current)) {
        setFormData(initialData);
        setSavedInitialData({ ...initialData });
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
        const { name, value } = e.target; // name = 'instagram' / 'discord' / 'website'
        setFormData(prevData => ({
            ...prevData,
            socials: {
                ...prevData.socials,
                [name]: value,
            },
        }));
    };

    // Pictures and Club Logo can't be handled yet
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
                        discord: data.socials?.discord?.trim() || undefined,
                        instagram: data.socials?.instagram?.trim() || undefined,
                        website: data.socials?.website?.trim() || undefined,
                    },
                    tags: tagsToSave.map(tag => tag._id).filter(Boolean) || undefined,
                    clubLogo: data.clubLogo || undefined,
                    pictures: data.pictures || undefined,
                };
            };
            const normalizedPayload = normalizeUpdatePayload(formData);
            console.log('Normalized payload:', normalizedPayload);
            const updatedClub = await updateClub(clubId, normalizedPayload);
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
