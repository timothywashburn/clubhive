import { useClubState, useMyClubsData } from '../features/my-clubs/hooks';
import ClubCardSmall from '../components/ClubCardSmall';
import { useState } from 'react';

export function Clubs() {
    const [searchTerm, setSearchTerm] = useState('');
    const { selectedClub, setSelectedClub } = useClubState();
    const { clubs, getClubColors } = useMyClubsData();

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
                            className="block w-full pl-10 pr-3 py-2 border text-on-surface border-outline-variant rounded-md leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-6">
                    {/* Left: club list */}
                    <div className="w-full lg:w-1/3 bg-surface rounded-lg shadow p-6 h-[calc(100vh-10rem)] scrollbar-hide overflow-y-auto space-y-4">
                        {(clubs || [])
                            .filter(club =>
                                club.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )
                            .map(club => (
                                <ClubCardSmall
                                    key={club.name}
                                    name={club.name}
                                    members={club.memberCount || 0}
                                    tagline={club.tagline}
                                    id={club.id}
                                    isSelected={
                                        selectedClub?.name === club.name
                                    }
                                    onClick={() => setSelectedClub(club)}
                                />
                            ))}
                    </div>

                    {/* Right: selected club detail */}
                    <div className="w-full lg:w-2/3 bg-surface rounded-lg shadow p-6 ">
                        {selectedClub ? (
                            <>
                                <div className="flex items-center gap-10 mb-5">
                                    <div
                                        className={`w-30 h-30 rounded-full flex items-center justify-center text-sm font-semibold ${getClubColors(selectedClub.id)}`}
                                    >
                                        picture
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h2 className="text-4xl text-on-surface font-bold mb-2">
                                            {selectedClub.name}
                                        </h2>
                                        <p className="text-on-surface-variant italic">
                                            {clubs.find(
                                                club =>
                                                    club.name ===
                                                    selectedClub.name
                                            )?.tagline || 'No tagline'}
                                        </p>
                                    </div>
                                </div>
                                <hr className="my-4 border-t border-outline-variant" />
                                <p className="text-sm text-on-surface-variant mb-4">
                                    {clubs.find(
                                        club => club.name === selectedClub.name
                                    )?.memberCount || 0}{' '}
                                    members
                                </p>

                                <div className="mt-6 flex flex-col items-center space-y-4">
                                    <p className="text-on-surface-variant">
                                        {clubs.find(
                                            club =>
                                                club.name === selectedClub.name
                                        )?.description || 'No description'}
                                    </p>
                                    <button className="mt-4 w-sm bg-primary text-on-primary py-2 rounded-md hover:bg-primary/90 font-medium transition-colors">
                                        View Club Profile
                                    </button>
                                </div>
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
