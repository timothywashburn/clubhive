import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import { useToast } from '../hooks/useToast';
import { clubWithEventsAndCountsSchema } from '@clubhive/shared';
import { ClubWithEventsData } from '@clubhive/shared/src/types/club-types';

export function ClubProfile() {
    const { url } = useParams<{ url: string }>();
    const [club, setClub] = useState<ClubWithEventsData | null>(null);
    const { errorToast } = useToast();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;
        fetch(`/api/clubs/by-url/${url}`)
            .then(res => res.json())
            .then(data => {
                console.log('Fetch result:', data);

                if (data.success) {
                    const parsed = clubWithEventsAndCountsSchema.parse(data.club);
                    setClub(parsed);
                    console.log('Upcoming events response:', data);
                } else {
                    const errorMessage = data.error?.message || 'Unknown error';
                    errorToast(`Failed to load club: ${errorMessage}`);
                }
            })
            .catch(err => {
                errorToast(`Failed to load club: ${err.message}`);
            })

            .finally(() => setLoading(false));
    }, [url]);

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

                {/* Join Club button*/}
                <div className="flex justify-end mb-5">
                    <button className="bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-primary/90 font-medium">Join Club</button>
                </div>

                {/* Club Profile header*/}
                <div className="bg-surface rounded-md p-6 border border-outline-variant flex items-center space-x-4 min-h-28 m-4">
                    {/* logo circle , replace with {club.clubLogo.url} later */}
                    <div className="w-1/3 flex items-center justify-center">
                        <div className="w-30 h-30 rounded-full bg-outline-variant flex items-center justify-center overflow-hidden">
                            {club.clubLogo ? (
                                <img src={club.clubLogo} alt={`${club.name} logo`} className="w-full h-full object-cover object-center" />
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
                        <button
                            onClick={() => setIsOpen(true)}
                            className="px-4 py-2 rounded-full font-medium border bg-surface text-on-surface border-outline hover:bg-outline-variant/30 transition-colors cursor-pointer"
                        >
                            Links
                        </button>
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

                {/* announcements */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-on-surface mb-4">Notifications</h2>
                    <div className="bg-surface rounded-lg p-6 border border-outline-variant">
                        <ul className="list-disc list-inside space-y-3 text-on-surface-variant">
                            <li>Club applications open until this date!</li>
                            <li>Our first GBM of the quarter is tomorrow!</li>
                            <li>Don't forget to fill out our social event interest form!</li>
                        </ul>
                    </div>
                </div>

                {/* gallery */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4 mt-8">Gallery</h2>
                <div className="overflow-x-auto">
                    {' '}
                    {/* scroll bar for images */}
                    <div className="flex space-x-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div
                                key={i}
                                className="min-w-[200px] h-40 bg-surface border border-outline-variant rounded-md flex-shrink-0 overflow-hidden"
                            >
                                <img
                                    src={`https://via.placeholder.com/200x160?text=Image+${i}`}
                                    alt={`Club image ${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* club officers */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4 mt-8">Our Officers</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((officer, i) => (
                        <div
                            key={i}
                            className="w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                        >
                            <div className="flex justify-end px-4 pt-4">
                                <button
                                    className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
                                    type="button"
                                >
                                    <span className="sr-only">Open dropdown</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 3">
                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-col items-center pb-10">
                                <img
                                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                    src="/docs/images/people/profile-picture-3.jpg"
                                    alt="Profile"
                                />
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">John Doe</h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400">President</span>
                                <div className="flex mt-4 md:mt-6">
                                    <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                        Contact
                                    </a>
                                    <a className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                        Year
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
