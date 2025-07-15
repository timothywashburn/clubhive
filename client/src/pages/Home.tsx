import { CalendarHeart, Megaphone } from 'lucide-react';
import { EventCardHomepage } from '../components/EventCardHomepage.tsx';
import { useNavigate } from 'react-router';
import { InboxCardHomepage } from '../components/InboxCardHomepage.tsx';

const messages = [
    {
        _id: '1',
        sender: 'Computer Science Club',
        title: 'Photography Workshop',
        body: 'The photography workshop today has been moved to Art Building Studio 3. See you there!',
    },
    {
        _id: '1',
        sender: 'Computer Science Club',
        title: 'Photography Workshop',
        body: 'The photography workshop today has been moved to Art Building Studio 3. See you there!',
    },
];

const upcomingEvents = [
    {
        _id: '1',
        club: 'arts-club',
        name: 'Photography Workshop',
        description: 'Learn advanced lighting techniques and composition.',
        type: 'workshop',
        location: 'Art Building Studio 3',
        date: '2025-07-15',
        startTime: '14:00',
        attendees: 10,
    },

    {
        _id: '2',
        club: 'arts-club',
        name: 'Photography Workshop',
        description: 'Learn advanced lighting techniques and composition.',
        type: 'workshop',
        location: 'Art Building Studio 3',
        date: '2025-07-15',
        startTime: '14:00',
        attendees: 10,
    },

    {
        _id: '3',
        club: 'arts-club',
        name: 'Photography Workshop',
        description: 'Learn advanced lighting techniques and composition.',
        type: 'workshop',
        location: 'Art Building Studio 3',
        date: '2025-07-15',
        startTime: '14:00',
        attendees: 10,
    },
];

export function Home() {
    const navigate = useNavigate();
    return (
        <div className="bg-background ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-on-surface mb-4">
                        Welcome to clubhive
                    </h1>
                    <p className="text-xl text-on-surface-variant mb-8">
                        Discover, join, and manage your clubs all in one place
                    </p>

                    <div className="max-w-7xl mx-auto px-4 mt-16">
                        <div className="grid grid-cols-2 gap-8">
                            {/* left card */}
                            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                                {/* header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <h2 className="text-xl text-on-surface">
                                            My Upcoming Events
                                        </h2>
                                        <CalendarHeart className="text-primary w-6 h-6 ml-2" />
                                    </div>

                                    <button
                                        onClick={() => navigate('/events')}
                                        className="bg-primary text-on-primary px-3 py-1.5 rounded-md text-sm font-normal hover:bg-primary/90"
                                    >
                                        + Add Event
                                    </button>
                                </div>

                                <div className="h-px bg-outline-variant w-full my-4" />

                                {/* event cards */}
                                <div className="space-y-4 mt-4">
                                    {upcomingEvents.map(evt => (
                                        <EventCardHomepage
                                            key={evt._id}
                                            name={evt.name}
                                            location={evt.location}
                                            date={evt.date}
                                            startTime={evt.startTime}
                                            description={evt.description}
                                            attendees={evt.attendees}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* right card */}
                            <div className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <h2 className="text-xl text-on-surface">
                                            Inbox
                                        </h2>
                                        <Megaphone className="text-primary w-6 h-6 ml-2" />
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate('/notifications')
                                        }
                                        className="bg-primary text-on-primary px-3 py-1.5 rounded-md text-sm font-normal hover:bg-primary/90"
                                    >
                                        + View All
                                    </button>
                                </div>

                                <div className="h-px bg-outline-variant w-full my-4" />

                                <div className="space-y-4 mt-4">
                                    {messages.map(msg => (
                                        <InboxCardHomepage
                                            key={msg._id}
                                            sender={msg.sender}
                                            title={msg.title}
                                            body={msg.body}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
