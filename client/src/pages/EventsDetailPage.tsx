import { useParams, useNavigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import { useEventTagsData } from '../hooks/useEventTagsData.ts';
import type { TagData } from '@clubhive/shared';
import { ArrowLeft, Paperclip, Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export function EventsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const { tags } = useEventTagsData();

    const { successToast, errorToast } = useToast();

    const copyToClipboard = async () => {
        const url = `${window.location.origin}/events/${event.event._id}`;
        try {
            await navigator.clipboard.writeText(url);
            successToast('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            errorToast('Failed to copy link');
        }
    };

    useEffect(() => {
        async function fetchEvent() {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch event');
                }
                const data = await res.json();
                console.log('API Response:', data);
                console.log('Event requirements:', data.data.event.requirements);
                setEvent(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id]);

    if (loading) return <div className="text-on-surface"> Loading event...</div>;
    if (!event) return <div className="text-on-surface">Event not found.</div>;

    return (
        <div className="h-full relative z-10">
            <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                <div className="flex justify-start mt-3 mb-7">
                    <button
                        onClick={() => navigate('/events')}
                        className="bg-surface text-on-surface border border-outline px-4 py-2 rounded-md hover:bg-surface/90 font-medium transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="inline-block mr-1 h-4" />
                        Find Events
                    </button>
                </div>

                <div className="bg-surface rounded-md p-6 mb-6 border border-outline-variant flex flex-col items-center space-y-2 min-h-28">
                    {' '}
                    <h1 className="text-5xl font-bold text-on-surface leading-tight">{event.event.name}</h1>
                    {event.event.club && (
                        <Link
                            to={`/club-profile/${event.club.url}`}
                            className="text-2xl text-on-surface-variant hover:text-primary transition-colors hover:underline inline-block mt-2"
                        >
                            {event.club.name}
                        </Link>
                    )}
                </div>

                {/* event flyer picture, only shows when picture is attached */}
                {event.event.picture && (
                    <div className="w-full flex justify-center mb-6 mt-6">
                        <img
                            src={event.event.picture}
                            alt="Event Flyer"
                            className="max-w-full max-h-96 object-contain rounded-md shadow-sm"
                        />
                    </div>
                )}

                <div className="flex justify-between items-start mb-6">
                    <div className="text-sm text-on-surface-variant flex flex-wrap gap-2">
                        {event.event.tags
                            ?.filter(tag => tag !== null && typeof tag === 'object')
                            .map(tag => (
                                <span key={tag._id} className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(tag._id)}`}>
                                    {tag.text}
                                </span>
                            ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            className="p-2 border rounded-md transition-colors hover:bg-surface-variant/40 cursor-pointer 
                                        text-on-surface-variant hover:text-on-surface border-outline"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setSaved(prev => !prev)}
                            className={`p-2 border rounded-md transition-colors hover:bg-surface-variant/40 cursor-pointer ${
                                saved
                                    ? 'border-primary text-primary hover:text-primary'
                                    : 'border-outline text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <h2 className="mt-10 text-2xl font-semibold text-on-surface mb-4">About This Event:</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-surface border border-outline-variant p-6 rounded-md">
                        <p className="text-on-surface leading-relaxed whitespace-pre-line">{event.event.description}</p>
                    </div>

                    <div className="bg-surface border border-outline-variant p-3 rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-surface-variant text-on-surface-variant px-2.5 py-1.5 rounded-md text-sm">
                                <span className="font-semibold text-on-secondary-container">Date: </span>
                                <span>{new Date(event.event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="bg-surface-variant text-on-surface-variant px-2.5 py-1.5 rounded-md text-sm">
                                <span className="font-semibold text-on-secondary-container">Time: </span>
                                <span>{event.event.startTime}</span>
                                {event.event.endTime && <span> – {event.event.endTime}</span>}
                            </div>
                            <div className="bg-surface-variant text-on-surface-variant px-2.5 py-1.5 rounded-md text-sm">
                                <span className="font-semibold text-on-secondary-container">Location: </span>
                                <span>{event.event.location || 'TBA'}</span>
                            </div>
                            <div className="bg-surface-variant text-on-surface-variant px-2.5 py-1.5 rounded-md text-sm">
                                <span className="font-semibold text-on-secondary-container">Type: </span>
                                <span>{event.event.type}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {event.event.requirements && (
                    <div className="bg-surface-variant p-4 rounded-md mt-6 mb-6">
                        <h3 className="font-medium text-on-secondary-container mb-2">Requirements to Attend:</h3>
                        <p className="text-on-surface-variant text-sm">{event.event.requirements}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
