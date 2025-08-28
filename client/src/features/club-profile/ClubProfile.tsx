import { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { getTagColor } from '../find-clubs/utils/TagColors.ts';
import JoinClubButton from './components/JoinClubButton.tsx';
import { useImageData } from '../../hooks/useImageData.ts';
import SocialLinks from '../find-clubs/components/SocialLinks.tsx';
import { useNotifications } from '../../hooks/useNotifications.ts';
import { useClubMembersData } from '../../hooks/useClubMembersData.ts';
import { useClubByUrl } from '../../hooks/useClubByUrl.ts';
import { ClubRole } from '@clubhive/shared';

function GalleryImage({ imageId }: { imageId: string }) {
    const { image, loading, error } = useImageData(imageId);

    if (loading) {
        return <div className="min-w-[200px] h-70 bg-outline-variant/10 rounded-md flex-shrink-0 animate-pulse" />;
    }

    if (error || !image) {
        return (
            <div className="min-w-[200px] h-70 bg-outline-variant/10 rounded-md flex-shrink-0 flex items-center justify-center">
                <span className="text-on-surface-variant text-sm">Failed to load</span>
            </div>
        );
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

    const { notifs, isLoading: notificationsLoading } = useNotifications();
    const clubNotifications = notifs.filter(notification => notification.club?.toString() === club?._id?.toString());

    const { image: clubLogoImage, error: logoError } = useImageData(club?.clubLogo ?? null);
    const logoUrl = clubLogoImage?.url && !logoError ? clubLogoImage.url : null;

    const { members, loading: membersLoading } = useClubMembersData(club?._id?.toString());

    const owner = useMemo(() => members.find(member => member.role === ClubRole.OWNER), [members]);

    const principalMembers = useMemo(() => members.filter(member => member.role === ClubRole.PRINCIPAL_MEMBER), [members]);
    const officerMembers = useMemo(() => members.filter(member => member.role === ClubRole.OFFICER), [members]);

    if (loading) return <div className="text-yellow-600 p-4">Loading club...</div>;
    if (!club) return <div className="text-red 500 p-4">Club not found.</div>;

    return (
        <div className="h-full relative">
            <div className="max-w-5xl mx-auto p-6">
                <div className="flex justify-start mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-surface text-on-surface border border-outline px-4 py-2 rounded-full hover:bg-outline-variant/30 font-medium transition-colors"
                    >
                        ← Find Clubs
                    </button>
                </div>

                {/* Join Club Button */}
                <div className="flex justify-end mb-5">
                    <JoinClubButton clubId={club._id} onJoinSuccess={() => {}} />
                </div>

                {/* Club Profile header*/}
                <div className="bg-surface rounded-md p-6 border border-outline-variant flex items-center space-x-4 min-h-28">
                    {/* logo circle , replace with {club.clubLogo.url} later */}
                    <div className="w-1/3 flex items-center justify-center">
                        <div className="w-30 h-30 rounded-full bg-outline-variant flex items-center justify-center overflow-hidden">
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

                <div className="my-6 relative">
                    {/* club tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {club.tags?.map((tag, index) => (
                            <span key={index} className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(tag._id)}`}>
                                {tag.text}
                            </span>
                        ))}
                    </div>

                    {/* links to socials */}
                    <div className="absolute top-0 right-0 flex space-x-4 w-[240px] justify-end">
                        <SocialLinks
                            discordUrl={club.socials.discord}
                            instagramUrl={club.socials.instagram}
                            websiteUrl={club.socials.website}
                        />
                    </div>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-surface rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
                            <p className="text-on-surface-variant mb-2">
                                <span>Website: </span>
                                <a
                                    href={club.socials?.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline ml-2"
                                >
                                    {club.socials?.website}
                                </a>
                            </p>
                            <p className="text-on-surface-variant mb-2">
                                <span>Instagram: </span>
                                <a
                                    href={club.socials?.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline ml-2"
                                >
                                    {club.socials?.instagram}
                                </a>
                            </p>
                            <p className="text-on-surface-variant mb-2">
                                <span>Discord: </span>
                                <a
                                    href={club.socials?.discord}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline ml-2"
                                >
                                    {club.socials?.discord}
                                </a>
                            </p>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-4 text-on-surface-variant hover:text-on-surface"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

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
                                    <div key={event._id} className="min-w-[300px] p-4 border rounded-lg shadow-sm bg-surface">
                                        <h3 className="font-semibold text-on-surface">
                                            <Link to={`/events/${event._id}`} className="text-primary hover:underline cursor-pointer">
                                                {event.name}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">
                                            📅 {event.date} ⏰ {event.startTime}
                                        </p>
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
                                    <div key={event._id} className="min-w-[300px] p-4 border rounded-lg shadow-sm bg-surface opacity-75">
                                        <h3 className="font-semibold text-on-surface">
                                            <Link to={`/events/${event._id}`} className="text-primary hover:underline cursor-pointer">
                                                {event.name}
                                            </Link>
                                        </h3>
                                        <p className="text-sm text-on-surface-variant">
                                            📅 {event.date} ⏰ {event.startTime}
                                        </p>
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

                <h2 className="mt-10 text-2xl font-semibold text-on-surface mb-4">Notifications</h2>
                {/* notifications */}
                <div className="bg-surface rounded-md p-6 border border-outline-variant">
                    {notificationsLoading ? (
                        <div className="text-on-surface-variant">Loading notifications...</div>
                    ) : clubNotifications.length > 0 ? (
                        <div className="space-y-3">
                            {clubNotifications.slice(0, 5).map(notification => (
                                <div key={notification._id} className="border-l-4 border-primary/20 pl-4 py-2">
                                    <span className="text-xs text-on-surface-variant">
                                        {new Date(notification.date).toLocaleDateString()}
                                    </span>
                                    <h4 className="font-medium text-on-surface">{notification.title}</h4>
                                    <p className="text-sm text-on-surface-variant mt-1 whitespace-pre-line">{notification.body}</p>
                                </div>
                            ))}

                            {clubNotifications.length > 5 && (
                                <button
                                    onClick={() => navigate('/notifications')}
                                    className="text-primary hover:text-primary/90 text-sm mt-2"
                                >
                                    View all notifications →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-on-surface-variant text-sm italic">No notifications from this club yet.</div>
                    )}
                </div>

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
                    {owner ? (
                        <div
                            key={owner.user._id.toString()}
                            className="bg-surface border border-outline-variant rounded-md p-4 flex flex-col items-center"
                        >
                            <h3 className="text-on-surface font-medium">{owner.user.name}</h3>
                            <p className="text-on-surface-variant text-sm"> Major: {owner.user.major}</p>
                            <p className="text-on-surface-variant text-sm">
                                {' '}
                                Year: {owner.user.year} ({owner.user.educationType})
                            </p>
                        </div>
                    ) : (
                        <p className="text-on-surface-variant text-sm italic">No owner listed yet.</p>
                    )}
                </div>

                {/* Principal Members */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4 mt-8">Principal Members</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {principalMembers.length > 0 ? (
                        principalMembers.map(({ user, role }) => (
                            <div
                                key={user._id.toString()}
                                className="bg-surface border border-outline-variant rounded-md p-4 flex flex-col items-center"
                            >
                                <h3 className="text-on-surface font-medium">{user.name}</h3>
                                <p className="text-on-surface-variant text-sm"> Major: {user.major}</p>
                                <p className="text-on-surface-variant text-sm">
                                    {' '}
                                    Year: {user.year} ({user.educationType})
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-on-surface-variant text-sm italic">No principal members listed yet.</p>
                    )}
                </div>

                {/* Officers */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4">Officers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {officerMembers.length > 0 ? (
                        officerMembers.map(({ user, role }) => (
                            <div
                                key={user._id.toString()}
                                className="bg-surface border border-outline-variant rounded-md p-4 flex flex-col items-center"
                            >
                                <h3 className="text-on-surface font-medium">{user.name}</h3>
                                <p className="text-on-surface-variant text-sm"> Major: {user.major}</p>
                                <p className="text-on-surface-variant text-sm">
                                    {' '}
                                    Year: {user.year} ({user.educationType})
                                </p>
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
