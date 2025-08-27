import React, { memo, useState, useEffect, useMemo } from 'react';
import { UserClubData } from '@clubhive/shared';
import { editClubInfo } from '../../../hooks/editClubInfo';
import { useClubTagsData } from '../../../hooks/useClubTagsData';
import { getTagColor } from '../../find-clubs/utils/TagColors';
import { TagSelectionPopup } from '../../find-clubs/components/TagsSelectionPopup';
import type { TagData } from '@clubhive/shared';

interface OfficerInfoProps {
    club: UserClubData;
}

export const OfficerInfo = memo(
    ({ club }: OfficerInfoProps) => {
        const [clubData, setClubData] = useState(null);
        const { tags } = useClubTagsData();
        const [selectedTags, setSelectedTags] = useState<TagData[]>([]);
        const [initialTags, setInitialTags] = useState<TagData[]>([]);

        useEffect(() => {
            let isCancelled = false;
            const fetchClub = async () => {
                try {
                    const response = await fetch(`/api/clubs/${club._id}`);
                    const data = await response.json();

                    if (!isCancelled) {
                        setClubData({
                            name: data.club.name,
                            tagline: data.club.tagline,
                            description: data.club.description || '',
                            url: data.club.url || '',
                            status: data.club.status,
                            joinRequirements: data.club.joinRequirements || '',
                            socials: {
                                website: data.club.socials?.website || '',
                                discord: data.club.socials?.discord || '',
                                instagram: data.club.socials?.instagram || '',
                            },
                            tags: data.club.tags,
                            clubLogo: data.club.clubLogo?.url || '',
                            pictures: data.club.pictures?.map(pic => pic.url) || [],
                        });

                        if (data.club.tags) {
                            const existingTags = data.club.tags.map(tag => ({
                                _id: tag._id || tag,
                                text: tag.text || tag,
                            }));
                            setSelectedTags(existingTags);
                            setInitialTags(existingTags);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching club:', error);
                    if (!isCancelled) {
                        setClubData(false);
                    }
                }
            };

            fetchClub();
            return () => {
                isCancelled = true;
            };
        }, [club._id]);

        const initialData = useMemo(() => {
            return (
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
                }
            );
        }, [clubData]);

        const resetTags = () => setSelectedTags([...initialTags]);
        const { formData, handlers } = editClubInfo(initialData, club._id, resetTags);

        if (clubData === null) return <div>Loading...</div>;
        if (clubData === false) return <div>Club not found</div>;

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
                            <select
                                name="status"
                                className="w-full p-2 border rounded"
                                value={formData.status || ''}
                                onChange={handlers.handleInputChange}
                            >
                                <option value="ANYONE_CAN_JOIN">Anyone can join</option>
                                <option value="REQUEST_TO_JOIN">Request to join</option>
                                <option value="CLOSED">Closed</option>
                            </select>
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
                                {selectedTags.map(tag => (
                                    <span
                                        key={tag._id}
                                        className={`px-2 py-1 rounded-full text-xs cursor-pointer ${getTagColor(tag._id)}`}
                                        onClick={() => setSelectedTags(selectedTags.filter(t => t._id !== tag._id))}
                                    >
                                        {tag.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow space-y-4">
                        <h2 className="text-lg font-bold">Add New</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tags</label>
                            <TagSelectionPopup tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} inline />
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
                    <button
                        onClick={() => handlers.handleSaveChanges(selectedTags)}
                        className="bg-primary text-white px-6 py-2 rounded hover:bg-green-600"
                    >
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
    },
    (prevProps, nextProps) => {
        return prevProps.club._id === nextProps.club._id;
    }
);
