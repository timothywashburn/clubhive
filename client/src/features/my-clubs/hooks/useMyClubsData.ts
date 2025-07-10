import { Club, Event, MembershipData } from '../types';

export const useMyClubsData = () => {
    const clubs: Club[] = [
        {
            id: '1',
            name: 'Video Game Development Club',
            description:
                'Build games, learn game design, and connect with fellow game developers.',
            memberCount: 85,
            role: 'owner',
            tagline: 'Play. Create. Innovate.',
            location: 'Engineering Building',
            meetingTime: 'Fridays 3:00 PM',
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#3b82f6',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#10b981',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#8b5cf6',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#ef4444',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#eab308',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#ec4899',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#6366f1',
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
            logoImage: '/vgdc-square-logo.png',
            brandColor: '#14b8a6',
        },
    ];

    const events: Event[] = [
        {
            id: '1',
            title: 'Club Meeting',
            date: 'Jun 25, 2025',
            time: '3:00 PM',
            location: 'Engineering Building Room 205',
            description: 'Monthly club meeting before summer break.',
            attendees: 23,
        },
        {
            id: '2',
            title: 'Month-End Review',
            date: 'Jun 30, 2025',
            time: '4:00 PM',
            location: 'Conference Room A',
            description: 'Review June accomplishments and July goals.',
            attendees: 15,
        },
        {
            id: '3',
            title: 'Independence Day Prep',
            date: 'Jul 1, 2025',
            time: '10:00 AM',
            location: 'Student Center',
            description: 'Prepare for July 4th celebration activities.',
            attendees: 32,
        },
        {
            id: '4',
            title: 'July Kickoff',
            date: 'Jul 2, 2025',
            time: '2:00 PM',
            location: 'Main Hall',
            description: 'Start July with team building activities.',
            attendees: 28,
        },
        {
            id: '5',
            title: 'Coding Workshop',
            date: 'Jul 8, 2025',
            time: '2:00 PM',
            location: 'Computer Lab',
            description: 'Introduction to React and modern web development.',
            attendees: 45,
        },
        {
            id: '6',
            title: 'Photography Workshop',
            date: 'Jul 15, 2025',
            time: '2:00 PM',
            location: 'Art Building Studio 3',
            description: 'Learn advanced lighting techniques and composition.',
            attendees: 18,
        },
        {
            id: '7',
            title: 'Gaming Tournament',
            date: 'Jul 15, 2025',
            time: '7:00 PM',
            location: 'Game Room',
            description: 'Weekly esports tournament with prizes.',
            attendees: 89,
        },
        {
            id: '8',
            title: 'Hackathon Prep',
            date: 'Jul 22, 2025',
            time: '1:00 PM',
            location: 'Tech Lab',
            description: 'Prepare for upcoming hackathon event.',
            attendees: 34,
        },
        {
            id: '9',
            title: 'Tech Talk',
            date: 'Jul 22, 2025',
            time: '4:00 PM',
            location: 'Auditorium',
            description: 'Guest speaker on AI and machine learning.',
            attendees: 67,
        },
        {
            id: '10',
            title: 'Networking Event',
            date: 'Jul 22, 2025',
            time: '6:30 PM',
            location: 'Business Center',
            description: 'Connect with industry professionals.',
            attendees: 52,
        },
        {
            id: '14',
            title: 'Panel Discussion',
            date: 'Jul 22, 2025',
            time: '8:00 PM',
            location: 'Conference Hall',
            description: 'Panel on career paths in technology.',
            attendees: 38,
        },
        {
            id: '11',
            title: 'Debate Practice',
            date: 'Jul 25, 2025',
            time: '3:00 PM',
            location: 'Debate Hall',
            description: 'Practice session for upcoming competition.',
            attendees: 24,
        },
        {
            id: '12',
            title: 'Summer Fair',
            date: 'Aug 1, 2025',
            time: '11:00 AM',
            location: 'Campus Quad',
            description: 'Annual summer celebration and fair.',
            attendees: 156,
        },
        {
            id: '13',
            title: 'Volunteer Day',
            date: 'Aug 5, 2025',
            time: '9:00 AM',
            location: 'Community Center',
            description: 'Community service project.',
            attendees: 41,
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
