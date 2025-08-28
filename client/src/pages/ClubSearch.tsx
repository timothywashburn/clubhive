import { useState } from 'react';
import { Link } from 'react-router';
import { useClubsData } from '../hooks/useClubsData.ts';
import type { ClubData } from '@clubhive/shared';
import type { TagData } from '@clubhive/shared';
import { useClubTagsData } from '../hooks/useClubTagsData.ts';
import ClubCardSmall from '../features/find-clubs/components/ClubCardSmall';
import FilterTagsButton from '../features/find-clubs/components/FilterTagsButton';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import SocialLinks from '../features/find-clubs/components/SocialLinks';
import { useImageData } from '../hooks/useImageData.ts';

export function Clubs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClub, setSelectedClub] = useState<ClubData | null>(null);
    const [selectedTags, setSelectedTags] = useState<TagData[]>([]);
    const { clubs, isLoading, error } = useClubsData();
    const { tags } = useClubTagsData();

    // this is how you get the club logo image data for the selected club
    const { image: clubLogoImage, error: logoError } = useImageData(selectedClub?.clubLogo ?? null);
    const logoUrl = clubLogoImage?.url && !logoError ? clubLogoImage.url : '/ucsd-logo.png';

    if (isLoading) return <p className="p-4 text-on-surface-variant">Loading clubs...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

    return (
        <div className="h-full relative">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-background">Find Clubs</h1>
                    <p className="text-on-background-variant mt-2">Discover clubs that match your interests</p>
                </div>

                <div className="flex h-10 mb-6">
                    <FilterTagsButton tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    <input
                        type="text"
                        placeholder="Search clubs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border text-on-surface border-outline-variant rounded-md rounded-l-none leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex flex-col lg:flex-row gap-3">
                    {selectedTags.map(tag => (
                        <span
                            key={tag._id}
                            className={`rounded-full px-3 py-1 text-xs font-semibold hover:cursor-pointer ${getTagColor(tag._id)}`}
                            onClick={() => setSelectedTags(selectedTags.filter(t => t._id !== tag._id))}
                        >
                            {tag.text}
                        </span>
                    ))}
                </div>

                <hr className="my-4 border-t border-outline-variant" />
                <div className="flex flex-row gap-6">
                    {/* Left: club list */}
                    <div className="w-full lg:w-1/3 bg-surface rounded-lg shadow p-6 h-[calc(100vh-10rem)] overflow-y-auto space-y-4">
                        {clubs
                            .filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .filter(
                                club =>
                                    selectedTags.length === 0 ||
                                    selectedTags.every(selectedTag => club.tags.some(tag => tag._id === selectedTag._id))
                            )
                            .map(club => (
                                <ClubCardSmall
                                    key={club._id}
                                    name={club.name}
                                    tagline={club.tagline}
                                    tags={club.tags}
                                    id={club._id}
                                    createdAt={club.createdAt}
                                    isSelected={selectedClub?._id === club._id}
                                    clubLogo={club.clubLogo}
                                    onClick={() => setSelectedClub(club)}
                                />
                            ))}
                    </div>

                    {/* Right: selected club detail */}
                    <div className="w-full lg:w-2/3 bg-surface rounded-lg shadow p-6">
                        {selectedClub ? (
                            <>
                                <div className="flex items-center gap-7">
                                    <div
                                        className={`w-40 h-40 rounded-full flex items-center justify-center text-sm font-semibold bg-primary-container text-primary`}
                                    >
                                        <img
                                            src={logoUrl}
                                            alt={selectedClub?.name ?? 'Club Logo'}
                                            className="w-40 h-40 object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 overflow-hidden -mb-6">
                                        <h2 className="text-5xl text-on-surface font-bold mb-2">{selectedClub.name}</h2>
                                        <p className="text-on-surface-variant text-lg italic">{selectedClub.tagline || 'No tagline'}</p>
                                    </div>
                                </div>
                                <hr className="my-4 border-t border-outline-variant" />
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-on-surface-variant mb-4 flex flex-wrap gap-2">
                                        {selectedClub.tags.map(tag => (
                                            <span
                                                key={tag._id}
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(tag._id)}`}
                                            >
                                                {tag.text}
                                            </span>
                                        ))}
                                    </div>
                                    <SocialLinks
                                        discordUrl={selectedClub.socials.discord}
                                        instagramUrl={selectedClub.socials.instagram}
                                        websiteUrl={selectedClub.socials.website}
                                    />
                                </div>
                                <div className="mt-6 text-on-surface-variant">{selectedClub.description || 'No description'}</div>

                                <div className="mt-6 flex justify-center">
                                    <Link
                                        to={`/club-profile/${selectedClub.url}`}
                                        className="mt-6 inline-block px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-dark transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <p className="text-on-surface-variant">Select a club to see details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
