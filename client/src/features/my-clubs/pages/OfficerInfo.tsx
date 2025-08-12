import { UserClubData } from '@clubhive/shared';
import { useState } from 'react';
import { saveClubChanges } from '../../../../../server/src/utils/save-changes';

interface OfficerInfoProps {
    club: UserClubData;
}

export function OfficerInfo({ club }: OfficerInfoProps) {
    const [formData, setFormData] = useState<UserClubData>(club);
    const [newTag, setNewTag] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevData => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleTagChange = e => {
        setNewTag(e.target.value);
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTag.trim() !== '') {
            setFormData(prevData => ({
                ...prevData,
                tags: [...prevData.tags, { text: newTag.trim(), _id: 'temp-id-' + Date.now() } as any],
            }));
            setNewTag('');
        }
    };

    const handleDeleteTag = tagId => {
        setFormData(prevData => ({
            ...prevData,
            tags: prevData.tags.filter(tag => tag._id !== tagId),
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const tagsToSave = formData.tags.filter(tag => !tag._id.startsWith('temp-id-')).map(tag => tag._id);
            const newTags = formData.tags.filter(tag => tag._id.startsWith('temp-id-')).map(tag => tag.text);

            const updatedData = {
                name: formData.name,
                tagline: formData.tagline,
                description: formData.description,
                url: formData.url,
                socials: formData.socials,
                tags: formData.tags,
                school: formData.school._id,
            };

            const response = await fetch(`/api/clubs/${club._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer edd26a4797e15471b1dc2394fa571f7517f8f3890d22d999051452b0c6c32377`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }

            const updatedClub = await response.json();

            console.log('Changes saved successfully:', updatedClub);
            alert('Changes saved successfully!');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Failed to save changes.');
        }
    };

    const handleDiscardChanges = () => {
        setFormData(club);
        setNewTag('');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-lg font-bold">Edit / Delete</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" className="w-full p-2 border rounded" defaultValue={club.name} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tagline</label>
                        <input type="text" className="w-full p-2 border rounded" defaultValue={club.tagline} />
                    </div>
                    {club.description && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea className="w-full p-2 border rounded" rows={4} defaultValue={club.description} />
                        </div>
                    )}
                    {club.url && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Url</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.url} />
                        </div>
                    )}
                    {club.socials.website && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.socials.website} />
                        </div>
                    )}
                    {club.socials.discord && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Discord</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.socials.discord} />
                        </div>
                    )}
                    {club.socials.instagram && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.socials.instagram} />
                        </div>
                    )}
                    {/* {club.clubLogo && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Club Logo</label>
                            <input type="mongoose.Schema.types.ObjectId" className="w-full p-2 border rounded" defaultValue={club.clubLogo} />
                        </div>
                    )}
                    {club.pictures && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Pictures</label>
                            <input type="mongoose.Schema.types.ObjectId" className="w-full p-2 border rounded" defaultValue={club.pictures} />
                        </div>
                    )} */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Tags</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                    {tag.text}
                                    <button className="ml-2 text-red-500 hover:text-red-700">×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-lg font-bold">Add New</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tags</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="Add new tag and press Enter" />
                    </div>
                    {!club.description && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea className="w-full p-2 border rounded" rows={4} defaultValue={club.description} />
                        </div>
                    )}
                    {!club.url && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Url</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.url} />
                        </div>
                    )}
                    {!club.socials.website && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.socials.website} />
                        </div>
                    )}
                    {!club.socials.discord && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Discord</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.socials.discord} />
                        </div>
                    )}
                    {!club.socials.instagram && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.socials.instagram} />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Membership Requirements</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="None" />
                    </div>
                    {!club.clubLogo && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Club Logo</label>
                            <input
                                type="mongoose.Schema.types.ObjectId"
                                className="w-full p-2 border rounded"
                                defaultValue={club.clubLogo}
                            />
                        </div>
                    )}
                    {!club.pictures && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Pictures</label>
                            <input
                                type="mongoose.Schema.types.ObjectId"
                                className="w-full p-2 border rounded"
                                defaultValue={club.pictures}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <button className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600">Save Changes</button>
                <button className="bg-secondary text-white px-6 py-2 rounded hover:bg-red-500 flex items-center gap-2">
                    Discard Changes
                </button>
            </div>
        </div>
    );
}
