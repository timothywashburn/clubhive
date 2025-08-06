import React from 'react';
import { useState } from 'react';

export function SendNotification() {
    const scheduled = [
        {
            club: 'Computer Science Club',
            title: 'Meeting Location Changed',
            time: 'in 1 day',
        },
        {
            club: 'Photography Society',
            title: 'Sign up for new event',
            time: '2 days ago',
        },
    ];

    const [club, setClub] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMsg(null);
        setSuccessMsg(null);

        if (!club || !title || !message) {
            setErrorMsg('Please fill Club, Title, and Message.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    club: club,
                    title: title,
                    body: message,
                }),
            });

            const json = await res.json();
            if (!res.ok || json?.success === false) {
                throw new Error(json?.error?.message || 'Failed to create announcement');
            }
            setSuccessMsg('Notification sent successfully.');
            setClub('');
            setTitle('');
            setMessage('');
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full relative">
            <div className="w-full py-8">
                <div className="mb-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-on-surface">Send Notifications</h1>
                    <p className="text-on-surface-variant mt-2">Plan and send announcements to members of your clubs</p>
                </div>

                <div className="flex gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="w-1/3 bg-surface rounded-lg shadow border border-outline-variant">
                        <div className="px-6 py-4 border-b border-outline-variant">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-on-surface">Announcement History</h2>
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            {scheduled.map((item, index) => {
                                const initials = item.club
                                    .split(' ')
                                    .map(word => word[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);

                                return (
                                    <div
                                        key={index}
                                        className="w-full rounded-md border border-outline-variant bg-surface p-4 shadow-sm hover:bg-surface-variant transition"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary text-primary-container font-semibold flex items-center justify-center">
                                                {initials}
                                            </div>

                                            <div className="flex justify-between w-full">
                                                <div>
                                                    <div className="text-on-surface font-medium text-base capitalize">{item.club}</div>
                                                    <div className="text-sm italic text-on-surface-variant mt-1">{item.title}</div>
                                                </div>

                                                <div className="text-right">
                                                    <div className="text-sm text-on-surface-variant whitespace-nowrap">{item.time}</div>
                                                    <div className="text-primary italic text-xs mt-1">edit</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <form className="bg-surface rounded-lg shadow border border-outline-variant p-6" onSubmit={handleSubmit}>
                            <div className="pb-4 border-b border-outline-variant mb-6">
                                <h2 className="text-lg font-medium text-on-surface">Create New Notification</h2>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="club" className="block text-sm font-medium text-on-surface mb-1">
                                        Club
                                    </label>
                                    <select
                                        id="club"
                                        name="club"
                                        value={club}
                                        onChange={e => setClub(e.target.value)}
                                        className="w-full rounded-md border border-outline-variant bg-surface p-2 text-on-surface"
                                    >
                                        <option value="">Select a club</option>
                                        <option value="507f1f77bcf86cd799439022">Computer Science Club</option>
                                        <option value="688c596bca3e5de39cdeb6f9">Women in Computing</option>
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="title" className="block text-sm font-medium text-on-surface mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="Enter title"
                                        className="w-full rounded-md border border-outline-variant bg-surface p-2 text-on-surface"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 mb-6">
                                <label htmlFor="message" className="block text-sm font-medium text-on-surface mb-2">
                                    Message Body
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full rounded-md border border-outline-variant bg-surface text-on-surface px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="mb-6 mt-4">
                                    <label className="block text-sm font-medium text-on-surface mb-2">Add Photos</label>
                                    <div className="w-full h-32 rounded-md border border-dashed border-outline-variant bg-surface-variant flex items-center justify-center text-on-surface-variant text-sm italic">
                                        Photo upload area
                                    </div>
                                </div>
                            </div>

                            {errorMsg && <p className="text-sm text-red-500 mb-2">{errorMsg}</p>}
                            {successMsg && <p className="text-sm text-green-600 mb-2">{successMsg}</p>}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary text-on-primary px-6 py-2 rounded-md font-medium shadow-sm hover:bg-primary/90 transition"
                                >
                                    {isSubmitting ? 'Sending…' : 'Send Notification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

