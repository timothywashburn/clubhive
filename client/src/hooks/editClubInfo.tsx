import { useState, useEffect, useRef } from 'react';
import { updateClub } from '../utils/updateClub';
import { UpdateClubRequest } from '@clubhive/shared';
import { ClubStatus } from '@clubhive/shared';

export const editClubInfo = (initialData, clubId) => {
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

    const [newTag, setNewTag] = useState('');
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

    const handleAddTag = e => {
        if (e.key === 'Enter' && newTag.trim() !== '') {
            const tempTag = {
                _id: `temp_${Date.now()}`, // temp id
                text: newTag.trim(),
                isNew: true,
            };
            setFormData(prevData => ({
                ...prevData,
                tags: [...prevData.tags, tempTag],
            }));
            setNewTag('');
        }
    };

    const handleDeleteTag = tagIndex => {
        setFormData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter((_, index) => index !== tagIndex),
        }));
    };

    // Needs debugging
    const handleSaveChanges = async () => {
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
                    tags:
                        data.tags
                            ?.map(tag => {
                                if (tag.isNew) return tag.text;
                                return tag._id || tag;
                            })
                            .filter(Boolean) || undefined,
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
        setNewTag('');
    };

    return {
        formData,
        newTag,
        setNewTag,
        handlers: {
            handleInputChange,
            handleSocialsChange,
            handleAddTag,
            handleDeleteTag,
            handleSaveChanges,
            handleDiscardChanges,
        },
    };
};
