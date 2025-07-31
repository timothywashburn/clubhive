import { UserClubData } from '@clubhive/shared';

interface OfficerInfoProps {
    club: UserClubData;
}

export function OfficerInfo({ club }: OfficerInfoProps) {
    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Edit Club Information</h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Club Name</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.name}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Tagline</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.tagline}
                        />
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
                            defaultValue={club.socials.website}
                            placeholder="https://website.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Discord</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.socials.discord}
                            placeholder="https://discord.gg/invite"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Instagram</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            defaultValue={club.socials.instagram}
                            placeholder="@username"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Club Tags</h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Current Tags</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {club.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-container text-on-primary-container"
                                >
                                    {tag.text}
                                    <button className="ml-2 text-on-primary-container hover:text-error">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            placeholder="Add new tag and press Enter"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">School Information</h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">School</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface-variant"
                            value={club.school.name}
                            disabled
                        />
                        <p className="text-xs text-on-surface-variant mt-1">School cannot be changed</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">School Location</label>
                        <input
                            type="text"
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface-variant"
                            value={club.school.location}
                            disabled
                        />
                        <p className="text-xs text-on-surface-variant mt-1">Location is managed by school administration</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button className="bg-primary text-on-primary px-6 py-2 rounded-md hover:bg-primary/90 font-medium cursor-pointer">
                    Save Changes
                </button>
                <button className="bg-surface-variant text-on-surface-variant px-6 py-2 rounded-md hover:bg-surface-variant/80 font-medium cursor-pointer">
                    Cancel
                </button>
            </div>
        </div>
    );
}
