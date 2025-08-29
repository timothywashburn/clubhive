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

interface SocialInputProps {
    label: string;
    id: string;
    prefix: string;
    placeholder: string;
    value: string;
    maxLength: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SocialInput = ({ label, id, prefix, placeholder, value, maxLength, onChange }: SocialInputProps) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-on-surface">
                {label}
            </label>
            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-outline-variant bg-surface-variant text-on-surface-variant text-sm">
                    {prefix}
                </span>
                <input
                    placeholder={placeholder}
                    type="text"
                    id={id}
                    name={id.replace('club-', '')}
                    className="flex-1 min-w-0 block w-full px-3 py-2 border rounded-none rounded-r-md border-outline-variant bg-surface text-on-surface"
                    value={value}
                    onChange={e => {
                        if (e.target.value.length <= maxLength) {
                            onChange(e);
                        }
                    }}
                />
            </div>
            <div className="text-right text-sm text-on-surface-variant mt-1">
                {value.length} / {maxLength}
            </div>
        </div>
    );
};

export const OfficerInfo = memo(
    ({ club }: OfficerInfoProps) => {
        const [clubData, setClubData] = useState<any>(null);
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
                            pictures: data.club.pictures?.map((pic: any) => pic.url) || [],
                        });

                        if (data.club.tags) {
                            const existingTags = data.club.tags.map((tag: any) => ({
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
                    socials: { website: '', discord: '', instagram: '' },
                    tags: [],
                    clubLogo: '',
                    pictures: [],
                }
            );
        }, [clubData]);

        const resetTags = () => setSelectedTags([...initialTags]);
        const { formData, handlers } = editClubInfo(initialData, club._id, resetTags);

        if (clubData === null) return <div className="text-on-surface">Loading...</div>;
        if (clubData === false) return <div className="text-error">Club not found</div>;

        return (
            <div className="min-h-screen bg-surface rounded-lg border border-outline-variant p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-surface p-4 rounded shadow space-y-4 border border-outline-variant">
                        <h2 className="text-lg font-bold text-on-surface">Edit / Delete</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-on-surface">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                value={formData.name || ''}
                                onChange={handlers.handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-on-surface">Tagline</label>
                            <input
                                type="text"
                                name="tagline"
                                className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                value={formData.tagline || ''}
                                onChange={handlers.handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-on-surface">Club Status</label>
                            <select
                                name="status"
                                className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
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
                                <label className="block text-sm font-medium mb-1 text-on-surface">Description</label>
                                <textarea
                                    name="description"
                                    className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                    rows={4}
                                    value={formData.description || ''}
                                    onChange={handlers.handleInputChange}
                                />
                            </div>
                        )}

                        {club.joinRequirements && (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-on-surface">Membership Requirements</label>
                                <input
                                    type="text"
                                    name="joinRequirements"
                                    className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                    value={formData.joinRequirements || ''}
                                    onChange={handlers.handleInputChange}
                                />
                            </div>
                        )}

                        {club.url && (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-on-surface">URL</label>
                                <input
                                    type="text"
                                    name="url"
                                    className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                    value={formData.url || ''}
                                    onChange={handlers.handleInputChange}
                                />
                            </div>
                        )}

                        {club.socials.website && (
                            <SocialInput
                                label="Website Link"
                                id="club-website"
                                prefix="https://"
                                placeholder="your-club-website"
                                value={formData.socials.website || ''}
                                maxLength={128}
                                onChange={handlers.handleSocialsChange}
                            />
                        )}
                        {club.socials.discord && (
                            <SocialInput
                                label="Discord Invite Link"
                                id="club-discord"
                                prefix="https://discord.com/invite/"
                                placeholder="your-club-invite"
                                value={formData.socials.discord || ''}
                                maxLength={64}
                                onChange={handlers.handleSocialsChange}
                            />
                        )}
                        {club.socials.instagram && (
                            <SocialInput
                                label="Instagram Profile Link"
                                id="club-instagram"
                                prefix="https://www.instagram.com/"
                                placeholder="your-club-account"
                                value={formData.socials.instagram || ''}
                                maxLength={64}
                                onChange={handlers.handleSocialsChange}
                            />
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1 text-on-surface">Current Tags</label>
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

                    <div className="bg-surface p-4 rounded shadow space-y-4 border border-outline-variant">
                        <h2 className="text-lg font-bold text-on-surface">Add New</h2>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-on-surface">Tags</label>
                            <TagSelectionPopup tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} inline />
                        </div>

                        {!club.description && (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-on-surface">Description</label>
                                <textarea
                                    name="description"
                                    onChange={handlers.handleInputChange}
                                    className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                    rows={4}
                                    value={formData.description || ''}
                                    placeholder="Add description"
                                />
                            </div>
                        )}

                        {!club.url && (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-on-surface">URL</label>
                                <input
                                    name="url"
                                    onChange={handlers.handleInputChange}
                                    type="text"
                                    className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
                                    value={formData.url || ''}
                                    placeholder="Add URL"
                                />
                            </div>
                        )}

                        {!club.socials.website && (
                            <SocialInput
                                label="Website Link"
                                id="club-website"
                                prefix="https://"
                                placeholder="your-club-website"
                                value={formData.socials.website || ''}
                                maxLength={128}
                                onChange={handlers.handleSocialsChange}
                            />
                        )}
                        {!club.socials.discord && (
                            <SocialInput
                                label="Discord Invite Link"
                                id="club-discord"
                                prefix="https://discord.com/invite/"
                                placeholder="your-club-invite"
                                value={formData.socials.discord || ''}
                                maxLength={64}
                                onChange={handlers.handleSocialsChange}
                            />
                        )}
                        {!club.socials.instagram && (
                            <SocialInput
                                label="Instagram Profile Link"
                                id="club-instagram"
                                prefix="https://www.instagram.com/"
                                placeholder="your-club-account"
                                value={formData.socials.instagram || ''}
                                maxLength={64}
                                onChange={handlers.handleSocialsChange}
                            />
                        )}

                        {!club.joinRequirements && (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-on-surface">Membership Requirements</label>
                                <input
                                    name="joinRequirements"
                                    onChange={handlers.handleInputChange}
                                    type="text"
                                    className="w-full p-2 border rounded bg-surface text-on-surface border-outline-variant"
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
                        className="bg-primary text-on-primary px-6 py-2 rounded hover:bg-primary/90"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={handlers.handleDiscardChanges}
                        className="bg-error text-on-error px-6 py-2 rounded hover:bg-error/90 flex items-center gap-2"
                    >
                        Discard Changes
                    </button>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => prevProps.club._id === nextProps.club._id
);
