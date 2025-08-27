import { useParams, useNavigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import { useEventTagsData } from '../hooks/useEventTagsData.ts';
import type { TagData } from '@clubhive/shared';

export function EventsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const { tags } = useEventTagsData();

    const copyToClipboard = async () => {
        const url = `${window.location.origin}/events/${event.event._id}`;
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
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
            <div className="min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-start mb-4">
                        <button
                            onClick={() => navigate('/events')}
                            className="bg-surface text-on-surface border border-outline px-4 py-2 rounded-full hover:bg-outline-variant/30 font-medium transition-colors cursor-pointer"
                        >
                            ← Find Events
                        </button>
                    </div>

                    <div className="text-center mb-8 mt-8 py-6 bg-surface rounded-lg border border-outline/20">
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
                        <div className="w-full flex justify-center mb-8">
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
                                className="px-6 py-2 rounded-full font-medium border bg-surface text-on-surface border-outline hover:bg-outline-variant/30 transition-colors cursor-pointer"
                            >
                                🔗 Event Link
                            </button>
                            <button
                                onClick={() => setSaved(prev => !prev)}
                                className={`px-4 py-2 rounded-full font-medium border transition-colors w-[120px] text-center cursor-pointer ${
                                    saved
                                        ? 'bg-primary text-on-secondary border-primary'
                                        : 'bg-surface text-on-surface border-outline hover:bg-outline-variant/30'
                                }`}
                            >
                                {saved ? 'Saved' : 'Save Event'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface-variant p-4 rounded-md mb-8">
                        <h3 className="font-medium text-on-secondary-container mb-2">About Event:</h3>
                        <p className="font-medium text-on-surface-variant">{event.event.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm flex-1">
                            <span className="font-semibold text-on-secondary-container">Date: </span>
                            <span>{new Date(event.event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm flex-1">
                            <span className="font-semibold text-on-secondary-container">Time: </span>
                            <span>{event.event.startTime}</span>
                        </div>
                        <div className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm flex-1">
                            <span className="font-semibold text-on-secondary-container">Location: </span>
                            <span>{event.event.location}</span>
                        </div>
                        <div className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm flex-1">
                            <span className="font-semibold text-on-secondary-container">Event Type: </span>
                            <span>{event.event.type}</span>
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
        </div>
    );
}
