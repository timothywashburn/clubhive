import { useState } from 'react';
import ClubCardSmall from '../components/ClubCardSmall';

export function Clubs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClub, setSelectedClub] = useState<string | null>(null);

    // Placeholder for clubs data
    const clubs = [
        {
            id: 1,
            name: 'Photography Club',
            members: 50,
            slogan: 'A club for photography enthusiasts.',
        },
        {
            id: 2,
            name: 'Book Club',
            members: 30,
            slogan: 'A club for book lovers.',
        },
        {
            id: 3,
            name: 'Coding Club',
            members: 40,
            slogan: 'A club for coding and tech enthusiasts.',
        },
        {
            id: 4,
            name: 'Art Club',
            members: 20,
            slogan: 'A club for artists and art lovers.',
        },
        {
            id: 5,
            name: 'Music Club',
            members: 25,
            slogan: 'A club for music enthusiasts.',
        },
        {
            id: 6,
            name: 'Gaming Club',
            members: 60,
            slogan: 'A club for gamers.',
        },
        {
            id: 7,
            name: 'Cooking Club',
            members: 15,
            slogan: 'A club for cooking enthusiasts.',
        },
        {
            id: 8,
            name: 'Travel Club',
            members: 10,
            slogan: 'A club for travel lovers.',
        },
        {
            id: 9,
            name: 'Fitness Club',
            members: 35,
            slogan: 'A club for fitness enthusiasts.',
        },
        {
            id: 10,
            name: 'Language Exchange Club',
            members: 45,
            slogan: 'A club for language learners.',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
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
                            className="block w-full pl-10 pr-3 py-2 border text-on-surface border-outline-variant rounded-md leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
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
                                    key={club.name}
                                    name={club.name}
                                    members={club.members}
                                    slogan={club.slogan}
                                    isSelected={selectedClub === club.name}
                                    onClick={() => setSelectedClub(club.name)}
                                />
                            ))}
                    </div>

                    {/* Right: selected club detail */}
                    <div className="w-full lg:w-2/3 bg-surface rounded-lg shadow p-6 max-h-96">
                        {selectedClub ? (
                            <>
                                <h2 className="text-2xl text-on-surface font-bold mb-2">
                                    {selectedClub}
                                </h2>
                                <p className="text-sm text-on-surface-variant mb-4">
                                    {clubs.find(
                                        club => club.name === selectedClub
                                    )?.members || 0}{' '}
                                    members
                                </p>
                                <p className="text-on-surface-variant">
                                    {clubs.find(
                                        club => club.name === selectedClub
                                    )?.slogan || 'No slogan'}
                                </p>
                                <button className="mt-4 w-full bg-primary text-on-primary py-2 rounded-md hover:bg-primary/90 font-medium transition-colors">
                                    Join Club
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
