import { Link } from 'react-router';
/**
 * THIS CLASS IS AI GENERATED AND TEMPORARY
 *
 * This class is a placeholder that bears no resemblance to the real
 * implementation for this page. This code is temporary and can be
 * replaced by the real implementation at any time.
 */
export function Events() {
    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface">
                        Events
                    </h1>
                    <p className="text-on-surface-variant mt-2">
                        Discover upcoming events from clubs you follow
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Placeholder event cards */}
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="bg-surface rounded-lg shadow p-6 border border-outline-variant"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-primary font-bold text-sm">
                                                C{i}
                                            </span>
                                        </div>
                                        <div>
                                            <Link
                                                to={`/events/${i}`}
                                                className="text-lg font-medium text-primary hover:underline"
                                            >
                                                Event {i}
                                            </Link>

                                            {/*<h3 className="text-lg font-medium text-on-surface">
                                                Event {i}
                                            </h3>*/}

                                            <p className="text-sm text-on-surface-variant">
                                                Club {i}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-on-surface-variant mb-4">
                                        Join us for an exciting event! This is a
                                        sample event description with details
                                        about what to expect.
                                    </p>
                                    <div className="flex items-center text-sm text-on-surface-variant space-x-4">
                                        <div className="flex items-center">
                                            <svg
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Jan {15 + i}, 2024
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {6 + i}:00 PM
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            Student Center
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium">
                                    RSVP
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
