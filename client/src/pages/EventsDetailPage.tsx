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
                    {/* back button */}
                    <div className="flex justify-start mb-4">
                        <button
                            onClick={() => navigate('/events')}
                            className="bg-surface text-on-surface border border-outline px-4 py-2 rounded-full hover:bg-outline-variant/30 font-medium transition-colors"
                        >
                            ← Find Events
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        {/* event title */}
                        <h1 className="text-4xl font-bold text-on-surface mb-4">
                            {event.event.name}
                            {event.event.club && (
                                <>
                                    {' - '}
                                    <Link
                                        to={`/club-profile/${event.club.url}`}
                                        className="text-on-surface text-secondary hover:text-primary transition-colors hover:underline"
                                    >
                                        {event.club.name}
                                    </Link>
                                </>
                            )}
                        </h1>
                    </div>

                    {/* flyer - only show if exists */}
                    {event.event.flyerUrl && (
                        <div className="w-full flex justify-center mb-8">
                            <img
                                src={event.event.flyerUrl}
                                alt="Event Flyer"
                                className="max-w-full max-h-96 object-contain rounded-md shadow-sm"
                            />
                        </div>
                    )}

                    {/* tags */}
                    <div className="text-sm text-on-surface-variant flex flex-wrap gap-2 mt-2 mb-4">
                        {event.event.tags
                            ?.filter(tag => tag !== null && typeof tag === 'object')
                            .map(tag => (
                                <span key={tag._id} className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(tag._id)}`}>
                                    {tag.text}
                                </span>
                            ))}
                    </div>

                    {/* date, location, event type, placeholder boxes */}
                    <div className="flex flex-wrap gap-4 items-center justify-between mb-4 mt-8">
                        <div className="flex gap-4 flex-wrap">
                            <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm">
                                📅 {new Date(event.event.date).toLocaleDateString()} - {event.event.startTime}
                            </span>
                            <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm">
                                📍 {event.event.location}
                            </span>
                            <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm">
                                🎉 {event.event.type}
                            </span>
                        </div>

                        {/* share, save buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="px-4 py-2 rounded-full font-medium border bg-surface text-on-surface border-outline hover:bg-outline-variant/30 transition-colors"
                            >
                                Share Event
                            </button>

                            <button
                                onClick={() => setSaved(prev => !prev)}
                                className={`px-4 py-2 rounded-full font-medium border transition-colors min-w-[100px] text-center ${
                                    saved
                                        ? 'bg-primary text-on-secondary border-primary'
                                        : 'bg-surface text-on-surface border-outline hover:bg-outline-variant/30'
                                }`}
                            >
                                {saved ? 'Saved' : 'Save Event'}
                            </button>
                        </div>

                        {/* Share button popup */}
                        {showShareModal && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-surface rounded-xl p-6 w-[90%] max-w-sm shadow-lg relative">
                                    <h2 className="text-lg font-semibold text-on-surface mb-4">Share Event</h2>
                                    <div className="space-y-2 text-on-surface-variant">
                                        <button
                                            onClick={copyToClipboard}
                                            className="text-left w-full hover:text-primary transition-colors hover:underline"
                                        >
                                            🔗 Copy Link
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowShareModal(false)}
                                        className="absolute top-3 right-4 text-on-surface-variant hover:text-on-surface"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* location description box 
                    <div className="bg-surface-variant p-4 rounded-md mb-6">
                        <h3 className="font-medium text-on-secondary-container mb-2">How to get there!</h3>
                        <p className="text-on-surface-variant text-sm">This event will be held in Price Center, located at:</p>
                    </div>
                    */}

                    {/* requirements to attend event */}
                    {event.requirements && (
                        <div className="bg-surface-variant p-4 rounded-md mt-6 mb-6">
                            <h3 className="font-medium text-on-secondary-container mb-2">Requirements to Attend:</h3>
                            <p className="text-on-surface-variant text-sm">{event.requirements}</p>
                        </div>
                    )}

                    {/* about event description box */}
                    <div className="bg-surface-variant p-4 rounded-md">
                        <h3 className="font-medium text-on-secondary-container mb-2">About Event:</h3>
                        <p className="text-on-surface-variant text-sm">{event.event.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
