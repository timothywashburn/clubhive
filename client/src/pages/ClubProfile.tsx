import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { clubSchema, ErrorCode } from '@clubhive/shared';
import Popup from '../features/club-profile/Popup';
import { handleRegistration } from '../../../server/src/services/joinClubService';

/**
 * This class is a static view of what the Club Profile page
 * might look like, may be temporary and changed.
 */
export function ClubProfile() {
    const { url } = useParams<{ url: string }>();
    const [club, setClub] = useState(null);
    const [error, setError] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const events = [
        //TODO: replace with real data!
        {
            title: 'Our first GBM of the quarter!',
            details: 'Every Thursday at 6PM, Red Shoe Room',
        },
        {
            title: 'Event',
            details: 'Friday at 5PM, Student Center',
        },
        {
            title: 'Event',
            details: 'Next Tuesday, 7PM, TEC Cafe',
        },
    ];

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
                    setClub(data.club);
                } else {
                    setError(data.error?.message || 'Unknown error');
                    //for troubleshooting:
                    console.error('Failed to load club:', data.error?.message);
                }
            })
            .catch(err => {
                setError(err.message);
                //for troubleshooting
                console.error('Network error:', err);
            })

            .finally(() => setLoading(false));
    }, [url]);

    if (loading) return <div className="text-yellow-600 p-4">Loading club...</div>;
    if (!club) return <div className="text-red 500 p-4">Club not found.</div>;

    // Membership Regsitration

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleConfirmRegistration = async () => {
        try {
            // if (!club?._id) {
            //     alert('Club ID is missing.');
            //     return;
            // }
            const response = await handleRegistration('507f1f77bcf86cd799439023');
            if (response.success) {
                alert('Successfully registered for the club!');
            } else {
                alert('Registration failed: ' + response.error?.message || 'Unknown error');
            }
        } catch (error) {
            alert('Something went wrong during registration.');
            console.error('Registration error:', error);
        } finally {
            closePopup();
        }
    };

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
                    <button
                        onClick={openPopup}
                        className="bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-primary/90 font-medium"
                    >
                        Join Club
                    </button>
                    <Popup isPopupOpen={isPopupOpen} onClose={closePopup}>
                        <h2 className="ml-24 text-xl font-bold mb-4">Almost there!</h2>
                        <button
                            type="button"
                            onClick={handleConfirmRegistration}
                            // onClick={closePopup}
                            className="ml-19 px-4 py-2 bg-primary text-white rounded hover:bg-green-600"
                        >
                            Confirm registration
                        </button>
                    </Popup>
                </div>

                {/* Club Profile header*/}
                <div className="bg-surface rounded-md p-6 border border-outline-variant flex items-center space-x-4 min-h-28 m-4">
                    {/* logo circle , replace with {club.clubLogo.url} later */}
                    <div className="w-1/3 flex items-center justify-center">
                        <div className="w-30 h-30 rounded-full bg-outline-variant flex items-center justify-center overflow-hidden">
                            {club.clubLogo?.url ? (
                                <img
                                    src={club.clubLogo.url}
                                    alt={`${club.name} logo`}
                                    className="w-full h-full object-cover object-center"
                                />
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
                            <span
                                key={index}
                                className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm font-medium"
                            >
                                #{tag.text}
                            </span>
                        ))}
                    </div>

                    {/* links to socials */}
                    <div className="absolute top-0 right-0 flex space-x-4 w-[240px] justify-end">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="px-4 py-2 rounded-full font-medium border bg-surface text-on-surface border-outline hover:bg-outline-variant/30 transition-colors"
                        >
                            Links
                        </button>
                    </div>
                </div>

                {isOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-surface rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
                            <p className="text-on-surface-variant">
                                Website:
                                <a
                                    href={club.socials?.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    {club.socials?.website}
                                </a>
                            </p>
                            <p className="text-on-surface-variant">
                                Instagram:
                                <a
                                    href={club.socials?.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    {club.socials?.instagram}
                                </a>
                            </p>
                            <p className="text-on-surface-variant">
                                Discord:
                                <a
                                    href={club.socials?.discord}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
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
                <h2 className="mt-10 text-2xl font-semibold text-on-surface mb-4">About Our Club: </h2>
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
                <h2 className="mt-10 text-2xl font-semibold text-on-surface mb-4">Upcoming Events: </h2>
                <div className="space-y-4">
                    <div className="space-y-4">
                        {events.map((event, index) => (
                            <div key={index} className="bg-surface rounded-md p-4 border border-outline-variant">
                                <h3 className="font-medium text-on-surface">{event.title}</h3>
                                <p className="text-on-surface-variant">{event.details}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* announcements */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-on-surface mb-4">Announcements</h2>
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
