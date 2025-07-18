import { Club } from '../types';

interface OfficerInfoProps {
    club: Club;
}

export function OfficerInfo({ club }: OfficerInfoProps) {
    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">
                    Edit Club Information
                </h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            rows={3}
                            defaultValue={club.description}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">
                                Meeting Time
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                                defaultValue={club.meetingTime}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                                defaultValue={club.location}
                            />
                        </div>
                    </div>
                    <button className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium cursor-pointer">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
