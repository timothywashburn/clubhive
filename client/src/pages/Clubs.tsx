import { useState } from 'react';
import { useClubData } from '../features/my-clubs/hooks/fetchClubs';
import ClubCardSmall from '../components/ClubCardSmall';

export function Clubs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClub, setSelectedClub] = useState<string | null>(null);
    const { clubs, isLoading, error } = useClubData();

    const getClubColors = (id: string) =>
        ['bg-pink-200', 'bg-blue-200', 'bg-green-200'][id.charCodeAt(0) % 3];

    if (isLoading)
        return <p className="p-4 text-on-surface-variant">Loading clubs...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

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
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border text-on-surface border-outline-variant rounded-md leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                </div>

                <div className="flex flex-row gap-6">
                    {/* Left: club list */}
                    <div className="w-full lg:w-1/3 bg-surface rounded-lg shadow p-6 h-[calc(100vh-10rem)] scrollbar-hide overflow-y-auto space-y-4">
                        {clubs
                            .filter(club =>
                                club.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )
                            .map(club => (
                                <ClubCardSmall
                                    key={club._id}
                                    name={club.name}
                                    tagline={club.tagline}
                                    tags={club.tags}
                                    id={club._id}
                                    isSelected={selectedClub?._id === club._id}
                                    onClick={() => setSelectedClub(club)}
                                />
                            ))}
                    </div>

                    {/* Right: selected club detail */}
                    <div className="w-full lg:w-2/3 bg-surface rounded-lg shadow p-6">
                        {selectedClub ? (
                            <>
                                <div className="flex items-center gap-10 mb-5">
                                    <div
                                        className={`w-30 h-30 rounded-full flex items-center justify-center text-sm font-semibold ${getClubColors(
                                            selectedClub._id
                                        )}`}
                                    >
                                        picture
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h2 className="text-4xl text-on-surface font-bold mb-2">
                                            {selectedClub.name}
                                        </h2>
                                        <p className="text-on-surface-variant italic">
                                            {selectedClub.tagline ||
                                                'No tagline'}
                                        </p>
                                    </div>
                                </div>
                                <hr className="my-4 border-t border-outline-variant" />
                                <div className="text-sm text-on-surface-variant mb-4 flex flex-wrap gap-2">
                                    {selectedClub.tags.map(tag => (
                                        <span
                                            key={tag._id}
                                            className="bg-primary-container text-primary rounded-full px-3 py-1 text-xs font-semibold"
                                        >
                                            {tag.tagName}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-6 text-on-surface-variant">
                                    {selectedClub.description ||
                                        'No description'}
                                </div>

                                <button
                                    className="mt-6 px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-dark transition-colors"
                                    onClick={() =>
                                        alert(
                                            'View Profile feature coming soon!'
                                        )
                                    }
                                >
                                    View Profile
                                </button>
                            </>
                        ) : (
                            <p className="text-on-surface-variant">
                                Select a club to see details.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
