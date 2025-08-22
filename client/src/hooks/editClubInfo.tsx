import { useState } from 'react';

export const editClubInfo = initialData => {
    const [formData, setFormData] = useState(initialData);
    const [newTag, setNewTag] = useState('');

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

    return {
        formData,
        newTag,
        setNewTag,
        handlers: {
            handleInputChange,
            handleSocialsChange,
            handleAddTag,
            handleDeleteTag,
        },
    };
};
