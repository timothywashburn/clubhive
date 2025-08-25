import { TagType } from '@clubhive/shared/src/types/tag-types';
import { useState, useEffect } from 'react';
import { UserClubData } from '@clubhive/shared';
import { editClubInfo } from '../../../hooks/editClubInfo';

interface OfficerInfoProps {
    club: UserClubData;
}

export function OfficerInfo({ club }: OfficerInfoProps) {
    const [clubData, setClubData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                const response = await fetch(`/api/clubs/${club._id}`);
                const data = await response.json();

                setClubData({
                    name: data.club.name,
                    tagline: data.club.tagline,
                    description: data.club.description || '',
                    url: data.club.url || '',
                    status: data.club.status || '',
                    joinRequirements: data.club.joinRequirements || '',
                    socials: {
                        website: data.club.socials?.website || '',
                        discord: data.club.socials?.discord || '',
                        instagram: data.club.socials?.instagram || '',
                    },
                    tags: data.club.tags.map(tag => tag.text),
                    clubLogo: data.club.clubLogo?.url || '',
                    pictures: data.club.pictures?.map(pic => pic.url) || [],
                });
            } catch (error) {
                console.error('Error fetching club:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClub();
    }, [club._id]);

    const { formData, newTag, setNewTag, handlers } = editClubInfo(
        clubData || {
            name: '',
            tagline: '',
            description: '',
            url: '',
            status: '',
            joinRequirements: '',
            socials: {
                website: '',
                discord: '',
                instagram: '',
            },
            tags: [],
            clubLogo: '',
            pictures: [],
        },
        club._id
    );

    if (loading) return <div>Loading...</div>;
    if (!clubData) return <div>Club not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-lg font-bold">Edit / Delete</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full p-2 border rounded"
                            value={formData.name || ''}
                            onChange={handlers.handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tagline</label>
                        <input
                            type="text"
                            name="tagline"
                            className="w-full p-2 border rounded"
                            value={formData.tagline || ''}
                            onChange={handlers.handleInputChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Club Status</label>
                        <input
                            type="text"
                            name="status"
                            className="w-full p-2 border rounded"
                            value={formData.status || ''}
                            onChange={handlers.handleInputChange}
                        />
                    </div>
                    {club.description && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                className="w-full p-2 border rounded"
                                rows={4}
                                value={formData.description || ''}
                                onChange={handlers.handleInputChange}
                            />
                        </div>
                    )}
                    {club.joinRequirements && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Membership Requirements</label>
                            <input
                                type="text"
                                name="joinRequirements"
                                className="w-full p-2 border rounded"
                                value={formData.joinRequirements || ''}
                                onChange={handlers.handleInputChange}
                            />
                        </div>
                    )}
                    {club.url && (
                        <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <input
                                type="text"
                                name="url"
                                className="w-full p-2 border rounded"
                                value={formData.url || ''}
                                onChange={handlers.handleInputChange}
                            />
                        </div>
                    )}
                    {club.socials.website && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input
                                type="text"
                                name="website"
                                className="w-full p-2 border rounded"
                                value={formData.socials.website || ''}
                                onChange={handlers.handleSocialsChange}
                            />
                        </div>
                    )}
                    {club.socials.discord && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Discord</label>
                            <input
                                type="text"
                                name="discord"
                                className="w-full p-2 border rounded"
                                value={formData.socials.discord || ''}
                                onChange={handlers.handleSocialsChange}
                            />
                        </div>
                    )}
                    {club.socials.instagram && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram</label>
                            <input
                                type="text"
                                name="instagram"
                                className="w-full p-2 border rounded"
                                value={formData.socials.instagram || ''}
                                onChange={handlers.handleSocialsChange}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Tags</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                    {tag}
                                    <button
                                        onClick={() => handlers.handleDeleteTag(index)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-lg font-bold">Add New</h2>
                    <div>
                        <label className="block text-sm font-medium mb-1">Tags</label>
                        <input
                            type="text"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={handlers.handleAddTag}
                            className="w-full p-2 border rounded"
                            placeholder="Add new tag and press Enter"
                        />
                    </div>
                    {!club.description && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                onChange={handlers.handleInputChange}
                                className="w-full p-2 border rounded"
                                rows={4}
                                value={formData.description || ''}
                                placeholder="Add description"
                            />
                        </div>
                    )}
                    {!club.url && (
                        <div>
                            <label className="block text-sm font-medium mb-1">URL</label>
                            <input
                                name="url"
                                onChange={handlers.handleInputChange}
                                type="text"
                                className="w-full p-2 border rounded"
                                value={formData.url || ''}
                                placeholder="Add URL"
                            />
                        </div>
                    )}
                    {!club.socials.website && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input
                                name="website"
                                onChange={handlers.handleSocialsChange}
                                type="text"
                                className="w-full p-2 border rounded"
                                value={formData.socials.website || ''}
                                placeholder="Add website URL"
                            />
                        </div>
                    )}
                    {!club.socials.discord && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Discord</label>
                            <input
                                name="discord"
                                onChange={handlers.handleSocialsChange}
                                type="text"
                                className="w-full p-2 border rounded"
                                value={formData.socials.discord || ''}
                                placeholder="Add Discord invite link"
                            />
                        </div>
                    )}
                    {!club.socials.instagram && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram</label>
                            <input
                                name="instagram"
                                onChange={handlers.handleSocialsChange}
                                type="text"
                                className="w-full p-2 border rounded"
                                value={formData.socials.instagram || ''}
                                placeholder="Add Instagram handle"
                            />
                        </div>
                    )}
                    {!club.joinRequirements && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Membership Requirements</label>
                            <input
                                name="joinRequirements"
                                onChange={handlers.handleInputChange}
                                type="text"
                                className="w-full p-2 border rounded"
                                value={formData.joinRequirements || ''}
                                placeholder="Add membership requirements"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <button onClick={handlers.handleSaveChanges} className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600">
                    Save Changes
                </button>
                <button
                    onClick={handlers.handleDiscardChanges}
                    className="bg-secondary text-white px-6 py-2 rounded hover:bg-red-500 flex items-center gap-2"
                >
                    Discard Changes
                </button>
            </div>
        </div>
    );
}
