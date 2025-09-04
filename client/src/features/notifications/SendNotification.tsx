import React, { useEffect } from 'react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { NotificationImageUploader } from '../../components/image-uploaders/NotificationImageUploader';
import type { ImageData } from '@clubhive/shared';
import { postNotificationRequestSchema } from '@clubhive/shared';
import { useToast } from '../../hooks/useToast';

const { errorToast } = useToast();

export function SendNotification() {
    const [club, setClub] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notificationImages, setNotificationImages] = useState<ImageData[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [clubHistory, setClubHistory] = useState('');
    const [historyItems, setHistoryItems] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [myOfficerClubs, setMyOfficerClubs] = useState([]);
    const [loadingClubs, setLoadingClubs] = useState(false);

    const maxTitleLength = 50;
    const maxMessageLength = 1000;

    useEffect(() => {
        const loadClubHistory = async () => {
            setLoadingHistory(true);
            try {
                const res = await fetch('/api/notifications', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();

                if (!res.ok || data.success === false) {
                    setErrorMsg(data?.error?.message);
                }

                setHistoryItems(data.notifications || []);
            } catch (e) {
                setErrorMsg(e.message || 'Failed to load club history');
            } finally {
                setLoadingHistory(false);
            }
        };
        void loadClubHistory();
    }, []);

    useEffect(() => {
        const loadClubs = async () => {
            setLoadingClubs(true);
            try {
                const res = await fetch('/api/me/clubs', {
                    method: 'GET',
                    credentials: 'include',
                });
                const payload = await res.json();

                if (!res.ok || payload?.success === false) {
                    setErrorMsg(payload?.error?.message || 'Failed to load clubs');
                }

                // get officers/exec/owner
                const eligible = (payload.clubs || []).filter(c => c.userRole !== 'member');
                setMyOfficerClubs(eligible);
            } catch (e) {
                setErrorMsg(e.message || 'Failed to load clubs');
            } finally {
                setLoadingClubs(false);
            }
        };

        void loadClubs();
    }, []);

    const handleImagesChange = (images: ImageData[]) => {
        setNotificationImages(images);
    };

    const handleUploadStateChange = (isUploading: boolean) => {
        setIsUploadingImages(isUploading);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrorMsg(null);
        setSuccessMsg(null);

        if (!club || !title || !message) {
            setErrorMsg('Please fill Club, Title, and Message.');
            return;
        }

        const result = postNotificationRequestSchema.safeParse({
            club: club,
            title: title,
            body: message,
        });
        if (!result) {
            const zodErrors = result.error.format();
            if (zodErrors.club?._errors.length) errorToast(zodErrors.club._errors[0]);
            if (zodErrors.title?._errors.length) errorToast(zodErrors.title._errors[0]);
            if (zodErrors.body?._errors.length) errorToast(zodErrors.body._errors[0]);
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    club: club,
                    title: title,
                    body: message,
                    pictures: notificationImages.map(img => img._id),
                }),
            });

            const json = await res.json();
            if (!res.ok || json?.success === false) {
                setErrorMsg(json?.error?.message);
            }
            setSuccessMsg('Notification sent successfully.');
            setClub('');
            setTitle('');
            setMessage('');
            setNotificationImages([]);
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        setErrorMsg(null);
        setSuccessMsg(null);

        const prevItems = historyItems;
        setHistoryItems(prevItems.filter(item => item._id !== id));

        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                setHistoryItems(prevItems);
                setErrorMsg(data?.error?.message || 'Failed to delete notification');
            } else {
                setSuccessMsg('Notification deleted.');
            }
        } catch (err) {
            setHistoryItems(prevItems);
            setErrorMsg(err.message || 'Failed to delete notification');
        }
    };

    return (
        <div className="h-full relative">
            <div className="w-full py-8">
                <div className="mb-8 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-on-surface">Send Notifications</h1>
                    <p className="text-on-surface-variant mt-2">Plan and send notifications to members of your clubs</p>
                </div>

                <div className="flex gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="w-1/3 bg-surface rounded-lg shadow border border-outline-variant">
                        <div className="px-6 py-4 border-b border-outline-variant">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-on-surface">Notification History</h2>

                                <select
                                    className="min-w-48 rounded-md border border-outline-variant bg-surface p-2 text-sm text-on-surface"
                                    value={clubHistory}
                                    onChange={e => setClubHistory(e.target.value)}
                                    disabled={loadingClubs || myOfficerClubs.length === 0}
                                    title="Filter by club"
                                >
                                    <option value="">{loadingClubs ? 'Loading…' : 'All clubs'}</option>
                                    {myOfficerClubs.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            {loadingHistory ? (
                                <div className="text-on-surface-variant text-sm italic">Loading history…</div>
                            ) : (
                                (clubHistory ? historyItems.filter(item => String(item.clubId) === clubHistory) : historyItems).map(
                                    (item, index) => {
                                        const club = myOfficerClubs.find(c => c._id === String(item.clubId));
                                        const clubName = club?.name || item.clubName || 'Unknown Club';
                                        const initials = clubName
                                            .split(' ')
                                            .map(w => w[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2);
                                        const time = formatDistanceToNow(new Date(item.date), { addSuffix: true }).replace(/^about\s/, '');

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
                                                            <div className="text-on-surface font-medium text-base capitalize">
                                                                {item.clubName}
                                                            </div>
                                                            <div className="text-sm italic text-on-surface-variant mt-1">{item.title}</div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-sm text-on-surface-variant whitespace-nowrap">{time}</div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const id = item._id;
                                                                    if (id && window.confirm('Delete this notification?')) {
                                                                        void handleDelete(id);
                                                                    }
                                                                }}
                                                                className="text-red-500 italic text-xs mt-1 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )
                            )}
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
                                        <option value="">
                                            {' '}
                                            {loadingClubs ? 'Loading…' : myOfficerClubs.length ? 'Select a club' : 'No eligible clubs'}{' '}
                                        </option>

                                        {myOfficerClubs.map((c, i) => {
                                            return (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            );
                                        })}
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
                                        onChange={e => {
                                            if (e.target.value.length <= maxTitleLength) {
                                                setTitle(e.target.value);
                                            }
                                        }}
                                        placeholder="Enter title"
                                        className="w-full rounded-md border border-outline-variant bg-surface p-2 text-on-surface"
                                    />
                                    <div className="text-right text-sm text-gray-500 mt-1">
                                        {title.length} / {maxTitleLength}
                                    </div>
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
                                    onChange={e => {
                                        if (e.target.value.length <= maxMessageLength) {
                                            setMessage(e.target.value);
                                        }
                                    }}
                                    className="w-full rounded-md border border-outline-variant bg-surface text-on-surface px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {message.length} / {maxMessageLength}
                                </div>
                            </div>

                            <div className="mb-6">
                                {club && (
                                    <NotificationImageUploader
                                        clubId={club}
                                        onImagesChange={handleImagesChange}
                                        onUploadStateChange={handleUploadStateChange}
                                        maxImages={5}
                                        maxFileSizeKB={5000}
                                    />
                                )}
                                {!club && (
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-on-surface">Add Photos</label>
                                        <div className="w-full h-32 rounded-md border border-dashed border-outline-variant bg-surface-variant flex items-center justify-center text-on-surface-variant text-sm italic">
                                            Select a club first to upload photos
                                        </div>
                                    </div>
                                )}
                            </div>

                            {errorMsg && <p className="text-sm text-red-500 mb-2">{errorMsg}</p>}
                            {successMsg && <p className="text-sm text-green-600 mb-2">{successMsg}</p>}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isUploadingImages}
                                    className="bg-primary text-on-primary px-6 py-2 rounded-md font-medium shadow-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Sending…' : isUploadingImages ? 'Uploading images...' : 'Send Notification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
