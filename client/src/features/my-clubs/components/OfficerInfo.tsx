import { Club } from '../types';
import { useState } from 'react';

interface OfficerInfoProps {
    club: Club;
}

export function OfficerInfo({ club }: OfficerInfoProps) {
    const [urlInput, setUrlInput] = useState(club.url || '');
    const [message, setMessage] = useState('');
    const [lastSavedUrl, setLastSavedUrl] = useState(club.url || '');

    /*
    const handleSave = async () => {
        const res = await fetch(`api/clubs/${club._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ url }),
        });

        const data = await res.json();
        if(data.success) {
            setMessage('Club info updated successfully.');
        } else {
            setMessage(data.error?.message || 'Update failed.');
        }
    }; */

    const handleSave = () => {
        setLastSavedUrl(urlInput.trim());
        setMessage('URL saved locally.');
    };

    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                <h3 className="text-lg font-medium text-on-surface mb-4">Edit Club Information</h3>
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">Description</label>
                        <textarea
                            className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                            rows={3}
                            defaultValue={club.description}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Meeting Time</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                                defaultValue={club.meetingTime}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1">Location</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                                defaultValue={club.location}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1">
                            Club Profile URL (will be in the form: http://localhost:5173/club-profile/your-url)
                        </label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                className="w-full p-3 border border-outline-variant rounded-md bg-surface text-on-surface"
                                placeholder="e.g. my-club-name"
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                            />
                            <button
                                onClick={handleSave}
                                disabled={!urlInput.trim()}
                                className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${
                                    urlInput.trim()
                                        ? 'bg-primary text-on-primary hover:bg-primary/90 cursor-pointer'
                                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                            >
                                Save URL
                            </button>
                        </div>
                    </div>

                    {message && <p className="text-sm text-primary">{message}</p>}
                    {lastSavedUrl && (
                        <p className="text-sm text-on-surface-variant mt-1 mb-6">
                            Last saved URL: http://localhost:5173/club-profile/{lastSavedUrl}
                        </p>
                    )}

                    <button
                        // onClick={handleSave}
                        className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium cursor-pointer"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
