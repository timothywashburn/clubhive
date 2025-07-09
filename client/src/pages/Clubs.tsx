import { useState } from 'react';

/**
 * THIS CLASS IS AI GENERATED AND TEMPORARY
 *
 * This class is a placeholder that bears no resemblance to the real
 * implementation for this page. This code is temporary and can be
 * replaced by the real implementation at any time.
 */
export function Clubs() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-background">
                        Find Clubs
                    </h1>
                    <p className="text-on-background-variant mt-2">
                        Discover clubs that match your interests
                    </p>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-on-surface-variant"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search clubs..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-outline-variant rounded-md leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div
                            key={i}
                            className="bg-surface rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-outline-variant"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
                                    <span className="text-on-primary-container font-bold">
                                        C{i}
                                    </span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-on-surface">
                                        Club {i}
                                    </h3>
                                    <p className="text-sm text-on-surface-variant">
                                        50 members
                                    </p>
                                </div>
                            </div>
                            <p className="text-on-surface-variant mb-4">
                                This is a sample club description. Join us for
                                amazing activities and events!
                            </p>
                            <button className="w-full bg-primary text-on-primary py-2 rounded-md hover:bg-primary/90 font-medium transition-colors">
                                Join Club
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
