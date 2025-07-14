import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

/**
 * This is the static frontend mockup of what an event would look like,
 * may be temporary and changed.
 */

export function EventsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [saved, setSaved] = useState(false);
    const [share, setShared] = useState(false);

    return (
        <div className="bg-background min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* back button */}
                <div className="flex justify-start mb-4">
                    <button
                        onClick={() => navigate('/events')}
                        className="bg-surface text-on-surface border border-outline px-4 py-2 rounded-full hover:bg-outline-variant/30 font-medium transition-colors"
                    >
                        ← Find Clubs
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    {/* event title */}
                    <h1 className="text-4xl font-bold text-on-surface mb-4">
                        Event Name
                    </h1>

                    {/* placeholder RSVP button */}
                    <button className="bg-primary text-on-primary px-6 py-2 rounded-full hover:bg-primary/90 font-medium">
                        RSVP
                    </button>
                </div>

                {/* flyer/thumbnail placeholder */}
                <div className="w-full h-64 bg-outline-variant rounded-md flex items-center justify-center text-on-surface-variant mb-8">
                    Event flyer/thumbnail
                </div>

                {/* tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['Social', 'Networking', 'Tech'].map((tag, idx) => (
                        <span
                            key={idx}
                            className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* date, location, event type, placeholder boxes */}
                <div className="flex flex-wrap gap-4 items-center justify-between mb-4 mt-8">
                    <div className="flex gap-4 flex-wrap">
                        <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm">
                            📅 September 1, 2025 – 6:00 PM
                        </span>
                        <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm">
                            📍 Price Center
                        </span>
                        <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-md text-sm">
                            🎉 Professional
                        </span>
                    </div>

                    {/* share, save buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShared(true)}
                            className="px-4 py-2 rounded-full font-medium border bg-surface text-on-surface border-outline hover:bg-outline-variant/30 transition-colors"
                        >
                            Share Event
                        </button>

                        <button
                            onClick={() => setSaved(prev => !prev)}
                            className={`px-4 py-2 rounded-full font-medium border transition-colors min-w-[100px] text-center ${
                                saved
                                    ? 'bg-primary text-on-primary border-primary'
                                    : 'bg-surface text-on-surface border-outline hover:bg-outline-variant/30'
                            }`}
                        >
                            {saved ? 'Saved' : 'Save Event'}
                        </button>
                    </div>

                    {/* Share button popup */}
                    {share && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-surface rounded-xl p-6 w-[90%] max-w-sm shadow-lg relative">
                                <h2 className="text-lg font-semibold text-on-surface mb-4">
                                    Share This Event
                                </h2>
                                <div className="space-y-2 text-on-surface-variant">
                                    <p>🔗 Copy Link</p>
                                    <p>📧 Share via Email</p>
                                    <p>🐦 Share on Twitter</p>
                                    <p>📘 Share on Facebook</p>
                                </div>
                                <button
                                    onClick={() => setShared(false)}
                                    className="absolute top-3 right-4 text-on-surface-variant hover:text-on-surface"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* location description box */}
                <div className="bg-surface-variant p-4 rounded-md mb-6">
                    <h3 className="font-medium text-on-secondary-container mb-2">
                        How to get there!
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                        This event will be held in Price Center, located at:
                    </p>
                </div>

                {/* about event description box */}
                <div className="bg-surface-variant p-4 rounded-md min-h-[200px]">
                    <h3 className="font-medium text-on-secondary-container mb-2">
                        About Event:
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                        Come meet fellow students and network with club leaders!
                        We'll have games, free food, and an overview of our
                        upcoming projects.
                    </p>
                </div>
            </div>
        </div>
    );
}
