import { useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * This class is a static view of what the Club Profile page
 * might look like, may be temporary and changed.
 */
export function ClubProfile() {
    //const { id } = useParams();
    const [saved, setSaved] = useState(false);
    const [description, setDescription] = useState('');
    const maxWords = 200;

    const handleDescriptionChange = e => {
        const input = e.target.value;
        const words = input.trim().split(/\s+/);
        if (words.length <= maxWords) {
            setDescription(input);
        }
    };

    const events = [
        {
            title: 'Our first GBM of the quarter!',
            details: 'Every Thursday at 6PM, Red Shoe Room',
        },
        {
            title: 'Hackathon Kickoff!',
            details: 'Friday at 5PM, Innovation Lab',
        },
        {
            title: 'Social Mixer',
            details: 'Next Tuesday, 7PM, Community Lounge',
        },
    ];

    return (
        <div className="bg-background">
            <div className="max-w-5xl mx-auto p-6">
                {/* Join Club button*/}
                <div className="flex justify-end mb-5">
                    <button className="bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-primary/90 font-medium">
                        Join Club
                    </button>
                </div>

                {/* Club Profile header*/}
                <div className="bg-surface rounded-md p-6 border border-outline-variant flex items-center space-x-4 min-h-28 m-4">
                    {/* logo circle */}
                    <div className="w-1/3 flex items-center justify-center">
                        <div className="w-30 h-30 rounded-full bg-primary-container flex items-center justify-center">
                            <span className="text-on-primary-container text-3xl font-bold">
                                logo
                            </span>
                        </div>
                    </div>

                    {/* club name and description */}
                    <div className="w-2/3 flex items-center">
                        <h1 className="text-6xl font-semibold text-on-surface text-center">
                            Clerb Name
                        </h1>
                    </div>
                </div>

                <div className="my-4 relative">
                    {/* club tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['Tech', 'Social', 'Food'].map((tag, index) => (
                            <span
                                key={index}
                                className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-sm font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="absolute top-0 right-0 flex space-x-2">
                        <button className="px-4 py-2 rounded-full font-medium border bg-surface text-on-surface border-outline hover:bg-outline-variant/30 transition-colors">
                            Socials
                        </button>
                        {/* save button */}
                        <button
                            onClick={() => setSaved(prev => !prev)}
                            className={`px-4 py-2 rounded-full font-medium border transition-colors min-w-[80px] text-center ${
                                saved
                                    ? 'bg-primary text-on-primary border-primary'
                                    : 'bg-surface text-on-surface border-outline hover:bg-outline-variant/30'
                            }
                            }`}
                        >
                            {saved ? 'Saved' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* club description */}

                <div className="mt-6">
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={6}
                        placeholder="Write a brief club description (max 200 words)... this is editable currently"
                        className="w-full p-4 bg-surface text-on-surface border border-outline-variant rounded-md resize-none text-sm leading-relaxed"
                    />
                    <div className="text-right text-xs text-on-surface-variant mt-1">
                        {description.trim().split(/\s+/).filter(Boolean).length}
                        /{maxWords} words
                    </div>
                </div>

                {/* events */}
                <h2 className="text-2xl font-semibold text-on-surface mb-4">
                    Upcoming Events
                </h2>
                <div className="space-y-4">
                    <div className="space-y-4">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="bg-surface rounded-md p-4 border border-outline-variant"
                            >
                                <h3 className="font-medium text-on-surface">
                                    {event.title}
                                </h3>
                                <p className="text-on-surface-variant">
                                    {event.details}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* announcements */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-on-surface mb-4">
                        Announcements
                    </h2>
                    <div className="bg-surface rounded-lg p-6 border border-outline-variant">
                        <ul className="list-disc list-inside space-y-3 text-on-surface-variant">
                            <li>Club applications open until this date!</li>
                            <li>Our first GBM of the quarter is tomorrow!</li>
                            <li>
                                Don't forget to fill out our social event
                                interest form!
                            </li>
                        </ul>
                    </div>
                </div>

                {/* gallery */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-on-surface mb-4">
                        Gallery
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <img
                            src="https://via.placeholder.com/300"
                            alt="Club photo 1"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <img
                            src="https://via.placeholder.com/300"
                            alt="Club photo 2"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <img
                            src="https://via.placeholder.com/300"
                            alt="Club photo 3"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
