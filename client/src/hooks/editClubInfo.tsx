import { useState, useEffect } from 'react';
import { updateClub } from './updateClub';
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

    const [formData, setFormData] = useState(initialData || defaultData);
    const [savedInitialData, setSavedInitialData] = useState(null);
    const [newTag, setNewTag] = useState('');

    useEffect(() => {
        if (initialData && initialData !== null) {
            console.log('Updating formData with:', initialData);
            setFormData(initialData);
            setSavedInitialData({ ...initialData });
        }
    }, [initialData]);

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
            setFormData(prevData => ({
                ...prevData,
                tags: [...prevData.tags, newTag.trim()],
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
                const statusMap: Record<string, ClubStatus> = {
                    'Anyone can join': ClubStatus.ANYONE_CAN_JOIN,
                    'Request to join': ClubStatus.REQUEST_TO_JOIN,
                    Closed: ClubStatus.CLOSED,
                };

                return {
                    name: data.name?.trim() || undefined,
                    tagline: data.tagline?.trim() || undefined,
                    description: data.description?.trim() || undefined,
                    url: data.url?.trim() || undefined,
                    joinRequirements: data.joinRequirements?.trim() || undefined,
                    status: statusMap[data.status] || undefined,
                    socials: data.socials
                        ? {
                              website: data.socials.website?.trim() || undefined,
                              discord: data.socials.discord?.trim() || undefined,
                              instagram: data.socials.instagram?.trim() || undefined,
                          }
                        : undefined,
                    clubLogo: data.clubLogo || undefined,
                    pictures: (data.pictures || []).filter((pic: string) => !!pic),
                    tags: (data.tags || []).map((tag: any) => (typeof tag === 'string' ? tag : tag._id)).filter(Boolean),
                };
            };

            const normalizedPayload = normalizeUpdatePayload(formData);
            console.log('Normalized payload:', normalizedPayload);
            const updatedClub = await updateClub(clubId, normalizedPayload);
            console.log('Update successful:', updatedClub);
        } catch (error) {
            console.error('Error saving changes:', error);
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
