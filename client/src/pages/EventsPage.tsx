import { useParams, useNavigate, Link } from 'react-router-dom';

/**
 * This is the static frontend mockup of what an event would look like,
 * may be temporary and changed.
 */

export function EventsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="bg-background min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* back button */}
                <button
                    onClick={() => navigate('/events')}
                    className="mb-4 text-sm text-primary underline hover:text-primary/80"
                >
                    ← All Events
                </button>

                {/* event title */}
                <h1 className="text-4xl font-bold text-on-surface mb-4">
                    Event Name
                </h1>

                {/* flyer/thumbnail placeholder */}
                <div className="w-full h-64 bg-outline-variant rounded-md flex items-center justify-center text-on-surface-variant">
                    Event flyer/thumbnail
                </div>

                {/* tags */}
                <div className="flex flex-wrap gap-2">
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
                <div className="flex flex-wrap gap-4 items-center justify-between">
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
                        <button className="bg-surface border border-outline text-on-surface px-3 py-1 rounded-md text-sm hover:bg-outline-variant/30">
                            Share Event
                        </button>
                        <button className="bg-surface border border-outline text-on-surface px-3 py-1 rounded-md text-sm hover:bg-outline-variant/30">
                            Save Event
                        </button>
                    </div>
                </div>

                {/* location description box */}
                <div className="bg-surface-variant p-4 rounded-md">
                    <h3 className="font-medium mb-2">How to get there!</h3>
                    <p className="text-on-surface-variant text-sm">
                        This event will be held in Price Center, located at ....
                        up the stairs...
                    </p>
                </div>

                {/* about event description box */}
                <div className="bg-surface-variant p-4 rounded-md">
                    <h3 className="font-medium mb-2">About Event:</h3>
                    <p className="text-on-surface-variant text-sm">
                        Come meet fellow students and network with club leaders!
                        We'll have games, free food, and an overview of our
                        upcoming projects.
                    </p>
                </div>

                {/* placeholder RSVP button */}
                <button className="bg-primary text-on-primary px-6 py-2 rounded-full hover:bg-primary/90 font-medium">
                    RSVP
                </button>
            </div>
        </div>
    );
}
