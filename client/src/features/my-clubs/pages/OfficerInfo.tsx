import { UserClubData } from '@clubhive/shared';

interface OfficerInfoProps {
    club: UserClubData;
}

export function OfficerInfo({ club }: OfficerInfoProps) {
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
                        <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                        <textarea
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            rows={4}
                            defaultValue={club.description}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Club URL</label>
                        <input
                            type="url"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.url}
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Social Media</h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Website</label>
                        <input
                            type="url"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.socials?.website}
                            placeholder="https://website.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Discord</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.socials?.discord}
                            placeholder="https://discord.gg/invite"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Instagram</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.socials?.instagram}
                            placeholder="@username"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Club Tags</h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Tags</label>
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Membership Requirements</label>
                        <input type="text" className="w-full p-2 border rounded" placeholder="None" />
                    </div>
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
