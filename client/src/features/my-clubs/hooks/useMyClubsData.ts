import { Club, Event, MembershipData } from '../types';

export const useMyClubsData = () => {
    const clubs: Club[] = [
        {
            id: '1',
            name: 'Computer Science Club',
            description:
                'A community for CS students to learn, network, and build projects together.',
            memberCount: 85,
            role: 'owner',
            tagline: 'Code. Create. Connect.',
            location: 'Engineering Building',
            meetingTime: 'Fridays 3:00 PM',
        },
        {
            id: '2',
            name: 'Photography Society',
            description:
                'Capture moments and improve your photography skills with fellow enthusiasts.',
            memberCount: 42,
            role: 'member',
            tagline: 'Capturing life, one frame at a time',
            location: 'Student Center',
            meetingTime: 'Wednesdays 4:00 PM',
        },
        {
            id: '3',
            name: 'Debate Team',
            description:
                'Sharpen your argumentative skills and compete in intercollegiate debates.',
            memberCount: 28,
            role: 'owner',
            tagline: 'Where words become weapons',
            location: 'Liberal Arts Building',
            meetingTime: 'Tuesdays 6:00 PM',
        },
        {
            id: '4',
            name: 'Gaming Club',
            description:
                'Play games, compete in tournaments, and hang out with fellow gamers.',
            memberCount: 156,
            role: 'member',
            tagline: 'Level up your social game',
            location: 'Student Center',
            meetingTime: 'Thursdays 5:00 PM',
        },
        {
            id: '5',
            name: 'Robotics Team',
            description:
                'Build robots, compete in competitions, and learn engineering skills.',
            memberCount: 34,
            role: 'officer',
            tagline: 'Building the future, one bot at a time',
            location: 'Engineering Lab',
            meetingTime: 'Mondays 4:00 PM',
        },
        {
            id: '6',
            name: 'Drama Club',
            description:
                'Perform in plays, improve acting skills, and express creativity.',
            memberCount: 67,
            role: 'member',
            tagline: "All the world's a stage",
            location: 'Theater Building',
            meetingTime: 'Tuesdays 7:00 PM',
        },
        {
            id: '7',
            name: 'Environmental Club',
            description:
                'Promote sustainability and environmental awareness on campus.',
            memberCount: 91,
            role: 'member',
            tagline: 'Think green, act now',
            location: 'Science Building',
            meetingTime: 'Wednesdays 3:00 PM',
        },
        {
            id: '8',
            name: 'Business Club',
            description:
                'Network with professionals and develop business skills.',
            memberCount: 123,
            role: 'officer',
            tagline: 'Your network is your net worth',
            location: 'Business Building',
            meetingTime: 'Fridays 2:00 PM',
        },
    ];

    const events: Event[] = [
        {
            id: '1',
            title: 'Weekly Project Showcase',
            date: 'Jan 15, 2024',
            time: '3:00 PM',
            location: 'Engineering Building Room 205',
            description:
                'Present your latest projects and get feedback from peers.',
            attendees: 23,
        },
        {
            id: '2',
            title: 'Guest Speaker: Industry Insights',
            date: 'Jan 22, 2024',
            time: '4:00 PM',
            location: 'Engineering Building Auditorium',
            description: 'Learn from a senior software engineer at Google.',
            attendees: 67,
        },
    ];

    const getClubColors = (clubId: string): string => {
        const colors = [
            'bg-blue-500 text-white',
            'bg-green-500 text-white',
            'bg-purple-500 text-white',
            'bg-red-500 text-white',
            'bg-yellow-500 text-black',
            'bg-pink-500 text-white',
            'bg-indigo-500 text-white',
            'bg-teal-500 text-white',
        ];
        const index = parseInt(clubId) % colors.length;
        return colors[index];
    };

    const getMembershipData = (club: Club): MembershipData => {
        const joinDates = {
            '1': 'September 15, 2023',
            '2': 'January 10, 2024',
            '3': 'August 5, 2023',
            '4': 'November 20, 2023',
            '5': 'October 8, 2023',
            '6': 'February 14, 2024',
            '7': 'December 3, 2023',
            '8': 'March 22, 2024',
        };

        const eventsAttended = {
            '1': 12,
            '2': 3,
            '3': 8,
            '4': 15,
            '5': 6,
            '6': 4,
            '7': 9,
            '8': 2,
        };

        return {
            joinDate:
                joinDates[club.id as keyof typeof joinDates] ||
                'January 1, 2024',
            eventsAttended:
                eventsAttended[club.id as keyof typeof eventsAttended] || 0,
            totalEvents: eventsAttended[club.id as keyof typeof eventsAttended]
                ? eventsAttended[club.id as keyof typeof eventsAttended] +
                  Math.floor(Math.random() * 5)
                : 5,
        };
    };

    return {
        clubs,
        events,
        getClubColors,
        getMembershipData,
    };
};
