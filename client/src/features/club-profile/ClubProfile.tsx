import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { getTagColor } from '../find-clubs/utils/TagColors.ts';
import JoinClubButton from './components/JoinClubButton.tsx';
import { useImageData } from '../../hooks/useImageData.ts';
import SocialLinks from '../find-clubs/components/SocialLinks.tsx';
import { useClubOfficersData } from '../../hooks/useClubOfficersData.ts';
import { useClubByUrl } from '../../hooks/useClubByUrl.ts';
import { ClubRole } from '@clubhive/shared';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

function GalleryImage({ imageId }: { imageId: string }) {
    const { image, loading, error } = useImageData(imageId);

    if (loading) {
        return <div className="min-w-[200px] h-70 bg-outline-variant/10 rounded-md flex-shrink-0 animate-pulse" />;
    }

    if (error || !image) {
        return <div className="min-w-[200px] h-70 bg-outline-variant/10 rounded-md flex-shrink-0 flex items-center justify-center"></div>;
    }

    return (
        <div className="min-w-[200px] h-70 bg-surface border border-outline-variant rounded-md flex-shrink-0 overflow-hidden">
            <img src={image.url} alt="Club gallery image" className="w-full h-full object-cover" />
        </div>
    );
}

export function ClubProfile() {
    const { url } = useParams<{ url: string }>();
    const { club, loading, error } = useClubByUrl(url);

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const { image: clubLogoImage, error: logoError } = useImageData(club?.clubLogo ?? null);
    const logoUrl = clubLogoImage?.url && !logoError ? clubLogoImage.url : null;

    const { officers, loading: officersLoading } = useClubOfficersData(club?._id?.toString());

    const owner = useMemo(() => officers.find(officer => officer.role === ClubRole.OWNER), [officers]);
    const principalMembers = useMemo(() => officers.filter(officer => officer.role === ClubRole.PRINCIPAL_MEMBER), [officers]);
    const officerMembers = useMemo(() => officers.filter(officer => officer.role === ClubRole.OFFICER), [officers]);

    if (loading) return <div className="text-yellow-600 p-4">Loading club...</div>;
    if (!club) return <div className="text-red 500 p-4">Club not found.</div>;

    return (
        <div className="h-full relative">
            <div className=" max-w-7xl mx-auto px-6 py-6">
                <div className="flex justify-start mt-3 mb-7">
                    <button
                        onClick={() => navigate('/clubs')}
                        className="bg-surface text-on-surface border border-outline px-4 py-2 rounded-md hover:bg-surface/90 hover:cursor-pointer font-medium transition-colors"
                    >
                        <ArrowLeft className="inline-block mr-1 h-4" />
                        Find Clubs
                    </button>
                </div>

                {/* Club Profile header*/}
                <div className="bg-surface rounded-md p-6 border border-outline-variant flex items-center space-x-4 min-h-28">
                    <div className="w-1/4 flex items-center justify-center">
                        <div className="w-40 h-40 rounded-full bg-outline-variant flex items-center justify-center overflow-hidden">
                            {logoUrl ? (
                                <img src={logoUrl} alt={`${club.name} logo`} className="w-full h-full object-cover object-center" />
                            ) : (
                                <span className="text-on-surface-variant text-sm text-center">No Logo</span>
                            )}
                        </div>
                    </div>

                    {/* club name and description */}
                    <div className="w-2/3 flex flex-col items-start">
                        <h1 className="text-6xl font-semibold text-on-surface">{club.name}</h1>
                        <p className="text-on-surface-variant text-lg mt-2 max-w-[400px]">{club.tagline}</p>
                    </div>
                </div>

                <div className="my-6 flex justify-between items-center">
                    {/* club tags on the left */}
                    <div className="flex flex-wrap gap-2">
                        {club.tags?.map((tag, index) => (
                            <span key={index} className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(tag._id)}`}>
                                {tag.text}
                            </span>
                        ))}
                    </div>

                    {/* links to socials on the right */}
                    <div>
                        <SocialLinks
                            discordUrl={club.socials.discord}
                            instagramUrl={club.socials.instagram}
                            websiteUrl={club.socials.website}
                        />
                    </div>
                </div>

                {/* club description */}
                <h2 className="mt-10 text-2xl font-semibold text-on-surface mb-4">About Our Club </h2>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                        <p className="text-on-surface leading-relaxed whitespace-pre-line border border-outline-variant p-4 rounded-md bg-surface">
                            {club.description}
                        </p>
                    </div>
                    <div className="bg-surface rounded-md p-4 border border-outline-variant text-on-surface text-center">
                        <p className="text-sm text-on-surface-variant">Members</p>
                        <p className="text-2xl font-semibold">{club.memberCount ?? 'N/A'}</p>
                        {/* Join Club Button */}
                        <div className="mt-2">
                            <JoinClubButton clubId={club._id} onJoinSuccess={() => {}} />
                        </div>
                    </div>
                </div>

                {/* events */}
                <h2 className="mt-10 text-2xl font-semibold text-on-surface mb-4">Our Events</h2>
                {/* upcoming events */}
                {club.upcomingEvents && club.upcomingEvents.length > 0 && (
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-on-surface mb-1">Upcoming Events</h3>
                        <div className="overflow-x-auto">
                            <div className="flex space-x-4">
                                {club.upcomingEvents.map(event => (
                                    <div
                                        key={event._id}
                                        className="min-w-[300px] p-4 border rounded-lg shadow-sm bg-surface border-outline-variant"
                                    >
                                        <h3 className="font-semibold text-on-surface">
                                            <Link to={`/events/${event._id}`} className="text-primary hover:underline cursor-pointer">
                                                {event.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-on-surface-variant mt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={16} className="text-on-surface-variant" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} className="text-on-surface-variant" />
                                                <span>{event.startTime}</span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-on-surface-variant">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {/* past events */}
                {club.pastEvents && club.pastEvents.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-on-surface mb-1">Recent Past Events</h3>
                        <div className="overflow-x-auto">
                            <div className="flex space-x-4">
                                {club.pastEvents.map(event => (
                                    <div
                                        key={event._id}
                                        className="min-w-[300px] p-4 border rounded-lg shadow-sm bg-surface opacity-60 border-outline-variant"
                                    >
                                        <h3 className="font-semibold text-on-surface">
                                            <Link to={`/events/${event._id}`} className="text-primary hover:underline cursor-pointer">
                                                {event.name}
                                            </Link>
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-on-surface-variant mt-2">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={16} className="text-on-surface-variant" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} className="text-on-surface-variant" />
                                                <span>{event.startTime}</span>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-on-surface-variant">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {/* no events message */}
                {!club.upcomingEvents?.length && !club.pastEvents?.length && (
                    <p className="text-on-surface-variant">Check back for events soon!</p>
                )}

                {/* gallery */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4 mt-8">Gallery</h2>
                <div className="overflow-x-auto">
                    <div className="flex space-x-4">
                        {club.pictures && club.pictures.length > 0 ? (
                            club.pictures.map(pictureId => <GalleryImage key={pictureId} imageId={pictureId} />)
                        ) : (
                            // Fallback if no pictures
                            <div className="min-w-[200px] h-40 bg-outline-variant/10 rounded-md flex-shrink-0 flex items-center justify-center">
                                <span className="text-on-surface-variant text-sm">No gallery images yet</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* club officers */}
                {/* Owner */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4 mt-8">Owner</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {officersLoading ? (
                        <p className="text-on-surface-variant text-sm">Loading officers...</p>
                    ) : owner ? (
                        <div className="bg-surface border border-outline-variant rounded-md p-4 flex flex-col items-center">
                            <h3 className="text-on-surface font-medium">{owner.name}</h3>
                            <p className="text-on-surface-variant text-sm capitalize">{owner.role}</p>
                        </div>
                    ) : (
                        <p className="text-on-surface-variant text-sm italic">No owner listed yet.</p>
                    )}
                </div>

                {/* Principal Members */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4 mt-8">Principal Members</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {officersLoading ? (
                        <p className="text-on-surface-variant text-sm">Loading officers...</p>
                    ) : principalMembers.length > 0 ? (
                        principalMembers.map((officer, index) => (
                            <div key={index} className="bg-surface border border-outline-variant rounded-md p-4 flex flex-col items-center">
                                <h3 className="text-on-surface font-medium">{officer.name}</h3>
                                <p className="text-on-surface-variant text-sm capitalize">{officer.role}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-on-surface-variant text-sm italic">No principal members listed yet.</p>
                    )}
                </div>

                {/* Officers */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4">Officers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {officersLoading ? (
                        <p className="text-on-surface-variant text-sm">Loading officers...</p>
                    ) : officerMembers.length > 0 ? (
                        officerMembers.map((officer, index) => (
                            <div key={index} className="bg-surface border border-outline-variant rounded-md p-4 flex flex-col items-center">
                                <h3 className="text-on-surface font-medium">{officer.name}</h3>
                                <p className="text-on-surface-variant text-sm capitalize">{officer.role}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-on-surface-variant text-sm italic">No officers listed yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
