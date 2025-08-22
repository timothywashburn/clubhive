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

    const { formData, newTag, setNewTag, handlers } = editClubInfo(clubData ? clubData : null);

    if (loading) return <div>Loading...</div>;
    if (!clubData) return <div>Club not found</div>;

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
                    <div>
                        <label className="block text-sm font-medium mb-1">Club Status</label>
                        <input type="text" className="w-full p-2 border rounded" defaultValue={club.status} />
                    </div>
                    {club.description && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea className="w-full p-2 border rounded" rows={4} defaultValue={club.description} />
                        </div>
                    )}
                    {club.joinRequirements && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Membership Requirements</label>
                            <input type="text" className="w-full p-2 border rounded" defaultValue={club.joinRequirements} />
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
                            {club.tags.map((tag, index) => (
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
                    {!club.joinRequirements && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Membership Requirements</label>
                            <input type="text" className="w-full p-2 border rounded" placeholder="None" />
                        </div>
                    )}
                    {/* {!club.clubLogo && (
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
                    )} */}
                    {/* {!club.clubLogo && (
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
                    )} */}
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
