import mongoose from 'mongoose';
import Club from '../src/models/club-schema';
import School from '../src/models/school-schema';
import Tag from '../src/models/tag-schema';
import User, { EducationType, Year } from '../src/models/user-schema';
import Auth from '../src/models/auth-schema';
import ClubMembership from '../src/models/club-membership-schema';
import Event from '../src/models/event-schema';
import Notification from '../src/models/notification-schema';
import UserNotification from '../src/models/user-notification-schema';
import { ClubhiveConfigModel } from '../src/models/clubhive-config-schema';
import { EventType, ClubRole, ClubStatus } from '@clubhive/shared';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import bcrypt from 'bcrypt';

const TEST_USER_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439020');
const UCSD_SCHOOL_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439021');
const CS_CLUB_ID = new mongoose.Types.ObjectId('507f1f77bcf86cd799439022');

async function seed() {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!);
    await School.deleteMany({});
    await Tag.deleteMany({});
    await Club.deleteMany({});
    await User.deleteMany({});
    await Auth.deleteMany({});
    await ClubMembership.deleteMany({});
    await Event.deleteMany({});
    await ClubhiveConfigModel.deleteMany({});
    await Notification.deleteMany({});
    await UserNotification.deleteMany({});

    await ClubhiveConfigModel.create({
        emsApi: {
            host: process.env.EMS_API_BASE_URL || '',
            token: process.env.EMS_API_TOKEN || '',
        },
        jwtSecret: process.env.JWT_SECRET || '',
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
            apiKey: process.env.CLOUDINARY_API_KEY || '',
            apiSecret: process.env.CLOUDINARY_API_SECRET || '',
        },
    });

    const [ucsd] = await School.insertMany([
        {
            _id: UCSD_SCHOOL_ID,
            name: 'University of California, San Diego',
            location: 'San Diego, CA',
            emailPattern: '^[a-zA-Z0-9._%+-]+@ucsd\\.edu$',
            emailError: 'Please use your UCSD email address (example@ucsd.edu)',
        },
    ]);

    const tags = await Tag.insertMany([
        { type: 'club', text: 'Technology' },
        { type: 'club', text: 'Career' },
        { type: 'club', text: 'Community' },
        { type: 'club', text: 'Diversity' },
        { type: 'club', text: 'Cultural' },
        { type: 'club', text: 'Academic' },
        { type: 'club', text: 'Professional Development' },
        { type: 'club', text: 'Service' },
        { type: 'club', text: 'STEM' },
        { type: 'club', text: 'Social' },
        { type: 'club', text: 'Leadership' },
        { type: 'club', text: 'Entrepreneurship' },
        { type: 'club', text: 'Health & Wellness' },
        { type: 'club', text: 'Media & Journalism' },
        { type: 'club', text: 'Politics & Activism' },
        { type: 'club', text: 'Music' },
        { type: 'club', text: 'Art' },
        { type: 'club', text: 'Dance' },
        { type: 'club', text: 'Sports' },
        { type: 'club', text: 'Gaming & Esports' },
        { type: 'club', text: 'Religion & Spirituality' },
        { type: 'club', text: 'Environmental' },
        { type: 'club', text: 'Robotics' },
        { type: 'club', text: 'Finance & Investing' },
        { type: 'club', text: 'Languages' },
        { type: 'club', text: 'Coding' },
        // Event tags
        { type: 'event', text: 'Workshop' },
        { type: 'event', text: 'Networking' },
        { type: 'event', text: 'Competition' },
        { type: 'event', text: 'Meeting' },
        { type: 'event', text: 'Educational' },
        { type: 'event', text: 'Social' },
        { type: 'event', text: 'Professional' },
        { type: 'event', text: 'Tournament' },
        { type: 'event', text: 'Hackathon' },
        { type: 'event', text: 'Tech Talk' },
        { type: 'event', text: 'Panel' },
        { type: 'event', text: 'Volunteer' },
        { type: 'event', text: 'Fair' },
        { type: 'event', text: 'Debate' },
        { type: 'event', text: 'Review' },
        { type: 'event', text: 'Preparation' },
        { type: 'event', text: 'Photography' },
        { type: 'event', text: 'Free Food' },
    ]);

    const clubTagMap = Object.fromEntries(tags.filter(t => t.type === 'club').map(t => [t.text, t._id]));
    const eventTagMap = Object.fromEntries(tags.filter(t => t.type === 'event').map(t => [t.text, t._id]));

    const [testUser, testUser2, userA, userB, userC, userD] = await User.insertMany([
        {
            _id: TEST_USER_ID,
            name: 'Test User',
            school: ucsd._id,
            major: 'Computer Science',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.THIRD,
            admin: true,
        },
        {
            name: 'Test User 2',
            school: ucsd._id,
            major: 'Data Science',
            educationType: EducationType.GRADUATE,
            year: Year.FIRST,
            admin: true,
        },
        {
            name: 'Alice Johnson',
            school: ucsd._id,
            major: 'Computer Science',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.SECOND,
        },
        {
            name: 'David Lee',
            school: ucsd._id,
            major: 'Math and Computer Science',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.THIRD,
        },
        {
            name: 'Bob Ross',
            school: ucsd._id,
            major: 'Computer Science',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.SECOND,
        },
        {
            name: 'Carol Lee',
            school: ucsd._id,
            major: 'Data Science',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.FOURTH,
        },
    ]);

    const hashedPassword = await bcrypt.hash('test', 10);
    await Auth.insertMany([
        {
            email: 'test@test.com',
            password: hashedPassword,
            emailVerified: true,
            userId: testUser._id,
        },
    ]);

    const clubs = await Club.insertMany([
        {
            _id: CS_CLUB_ID,
            name: 'Computer Science Club',
            tagline: 'Innovate, Code, Collaborate',
            description:
                'The Computer Science Club at UCSD is a dynamic community for students who are passionate about coding, software engineering, and emerging technologies. From hands-on coding workshops and competitive hackathons to resume reviews and tech talks with industry professionals, we aim to provide a space where every aspiring developer can grow. Whether you’re just starting out or looking to deepen your technical expertise, CSC helps you connect, collaborate, and create.',
            url: 'cs-club',
            school: ucsd._id,
            tags: [
                clubTagMap['Technology'],
                clubTagMap['Academic'],
                clubTagMap['Professional Development'],
                clubTagMap['STEM'],
                clubTagMap['Career'],
                clubTagMap['Coding'],
            ],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://csclub.ucsd.edu',
                discord: 'https://discord.gg/csclub',
                instagram: 'https://instagram.com/csclub',
            },
            pictures: [],
        },
        {
            name: 'Hack the Triton',
            tagline: 'UCSD’s Hackathon Org',
            description:
                'Hack the Triton is UCSD’s premier hackathon organization, dedicated to empowering students of all majors and backgrounds to build creative, impactful projects. We host annual hackathons, weekly tech events, and collaborative programming sessions where students learn by doing. Our goal is to foster a supportive ecosystem of builders, innovators, and problem-solvers who want to make a difference through technology.',
            url: 'hack-the-triton',
            school: ucsd._id,
            tags: [
                clubTagMap['Technology'],
                clubTagMap['Entrepreneurship'],
                clubTagMap['Professional Development'],
                clubTagMap['STEM'],
                clubTagMap['Career'],
                clubTagMap['Coding'],
            ],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://hackthetriton.ucsd.edu',
                discord: 'https://discord.gg/hackucsd',
                instagram: 'https://instagram.com/hackucsd',
            },
        },
        {
            name: 'Women in Computing',
            tagline: 'Empowering Women in Tech at UCSD',
            description:
                'Women in Computing (WiC) at UCSD is a supportive network for women and non-binary individuals pursuing computing and technology. Through mentorship programs, technical workshops, speaker panels, and social events, WiC aims to empower underrepresented groups in tech and foster inclusivity. Our mission is to create an equitable environment where everyone feels welcome and confident to explore their interests in CS and beyond.',
            url: 'wic',
            school: ucsd._id,
            tags: [
                clubTagMap['Diversity'],
                clubTagMap['Technology'],
                clubTagMap['Professional Development'],
                clubTagMap['Academic'],
                clubTagMap['STEM'],
                clubTagMap['Career'],
                clubTagMap['Coding'],
            ],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://wic.ucsd.edu',
                discord: '',
                instagram: 'https://instagram.com/wic_ucsd',
            },
        },
        {
            name: 'Triton Community Club',
            tagline: 'Connect. Serve. Grow.',
            description:
                'Triton Community Club is committed to making a positive impact in the San Diego community through acts of service, advocacy, and connection. We organize regular volunteering events, community drives, and social impact initiatives that address local needs. The club is open to anyone with a heart for helping others and a desire to build stronger, more connected communities both on and off campus.',
            url: 'triton-community',
            school: ucsd._id,
            tags: [clubTagMap['Service'], clubTagMap['Community'], clubTagMap['Leadership']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://community.ucsd.edu',
                discord: '',
                instagram: '',
            },
        },
        {
            name: 'Workshop Central',
            tagline: 'Learn and Build, Weekly',
            description:
                'Workshop Central is the go-to club for students eager to learn by doing. Every week, we host beginner-friendly and advanced workshops covering topics like web development, AI, game design, and more. With a focus on accessibility and growth, our events are open to all skill levels. We’re passionate about hands-on learning and helping students build real-world skills outside the classroom.',
            url: 'workshop-central',
            school: ucsd._id,
            tags: [clubTagMap['Technology'], clubTagMap['Academic'], clubTagMap['STEM'], clubTagMap['Career']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://workshopcentral.ucsd.edu',
                discord: 'https://discord.gg/workshops',
                instagram: 'https://instagram.com/workshopcentral',
            },
        },
        {
            name: 'Startup Circle',
            tagline: 'Launch Your Ideas',
            description:
                'Startup Circle is a hub for entrepreneurial students looking to turn their ideas into real ventures. We provide pitch opportunities, mentorship from founders and investors, and connections to funding resources. Whether you’re building a business, app, or product, we support you through every stage of the startup journey.',
            url: 'startup-circle',
            school: ucsd._id,
            tags: [clubTagMap['Entrepreneurship'], clubTagMap['Career'], clubTagMap['Leadership']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://startupcircle.ucsd.edu',
                discord: '',
                instagram: 'https://instagram.com/startupcircle',
            },
        },
        {
            name: 'Triton Gamers',
            tagline: 'Play. Compete. Connect.',
            description:
                'Triton Gamers brings together students who are passionate about games—whether it’s casual play, competitive esports, or game development. We host tournaments, game nights, and dev jams that build a thriving gaming community. Everyone from button mashers to elite competitors is welcome.',
            url: 'triton-gamers',
            school: ucsd._id,
            tags: [clubTagMap['Gaming & Esports'], clubTagMap['Community'], clubTagMap['Social'], clubTagMap['Technology']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://gamers.ucsd.edu',
                discord: 'https://discord.gg/gaming',
                instagram: 'https://instagram.com/ucsdcgg',
            },
        },
        {
            name: 'Triton Creatives',
            tagline: 'Create Beyond the Classroom',
            description:
                'Triton Creatives is a collective of students passionate about visual, musical, and literary arts. We host exhibitions, open mics, and collaborative projects that give creators a space to express and share their work. Whether you are into film, photography, music, or poetry, you will find your creative community here.',
            url: 'triton-creatives',
            school: ucsd._id,
            tags: [clubTagMap['Art'], clubTagMap['Music'], clubTagMap['Media & Journalism'], clubTagMap['Community']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://creatives.ucsd.edu',
                discord: '',
                instagram: 'https://instagram.com/tritoncreatives',
            },
        },
        {
            name: 'Diversity in Data',
            tagline: 'Making Data Accessible and Equitable',
            description:
                'Diversity in Data is a student-led group focused on inclusive and ethical data practices. We organize talks, collaborative data projects, and community research initiatives aimed at addressing bias in tech. Our goal is to amplify underrepresented voices in data science and ensure data is used for good.',
            url: 'diversity-in-data',
            school: ucsd._id,
            tags: [clubTagMap['Diversity'], clubTagMap['STEM'], clubTagMap['Technology'], clubTagMap['Academic']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://diversitydata.ucsd.edu',
                discord: '',
                instagram: 'https://instagram.com/diversitydata',
            },
        },
        {
            name: 'InfoSessions @ UCSD',
            tagline: 'Your Gateway to Industry',
            description:
                'InfoSessions @ UCSD connects students with tech recruiters, engineers, and professionals through weekly events and industry panels. We aim to bridge the gap between education and employment by helping students explore careers, understand job roles, and network effectively.',
            url: 'infosessions-at-ucsd',
            school: ucsd._id,
            tags: [clubTagMap['Career'], clubTagMap['Professional Development'], clubTagMap['STEM']],
            status: ClubStatus.ANYONE_CAN_JOIN,
            socials: {
                website: 'https://infosessions.ucsd.edu',
                discord: '',
                instagram: '',
            },
        },
    ]);

    await ClubMembership.insertMany([
        { user: testUser._id, club: clubs[0]._id, role: ClubRole.OWNER },
        { user: testUser._id, club: clubs[1]._id, role: ClubRole.MEMBER },
        { user: testUser._id, club: clubs[4]._id, role: ClubRole.OFFICER },
        { user: testUser2._id, club: clubs[0]._id, role: ClubRole.OFFICER },

        { user: testUser2._id, club: clubs[2]._id, role: ClubRole.MEMBER },
        { user: testUser2._id, club: clubs[6]._id, role: ClubRole.OWNER },

        { user: userA._id, club: clubs[0]._id, role: ClubRole.OFFICER },
        { user: userB._id, club: clubs[0]._id, role: ClubRole.OFFICER },
        { user: userC._id, club: clubs[0]._id, role: ClubRole.MEMBER },
        { user: userD._id, club: clubs[0]._id, role: ClubRole.MEMBER },

        { user: userA._id, club: clubs[1]._id, role: ClubRole.MEMBER },
        { user: userB._id, club: clubs[2]._id, role: ClubRole.MEMBER },
        { user: userC._id, club: clubs[3]._id, role: ClubRole.OFFICER },
        { user: userD._id, club: clubs[1]._id, role: ClubRole.MEMBER },
    ]);

    const notifications = await Notification.insertMany([
        {
            club: clubs[0]._id,
            title: 'Meeting Location Changed',
            body:
                'The Computer Science Club meeting location has been changed for this week.\n' +
                '\n' +
                'New Location: Room 204, Engineering Building\n' +
                'Date and Time: Thursday at 5:00 PM (same time as usual)\n' +
                '\n' +
                "Please make sure to go to the updated room. We'll still have our regular activities, updates on upcoming projects, and time to connect with fellow members. Looking forward to seeing you there.",
            pictures: [],
        },

        {
            club: clubs[1]._id,
            title: 'New Event Registration',
            body: 'Registration is open for our new event! Please see discord for more information. We look forward to seeing you there.',
            pictures: [],
        },

        {
            club: clubs[2]._id,
            title: 'Member applications open now!',
            body: 'To apply for a position follow the form in discord. Please submit applications in the next week.',
            pictures: [],
        },
    ]);

    await UserNotification.insertMany([
        {
            user: TEST_USER_ID,
            notification: notifications[0]._id,
            read: false,
        },
        {
            user: TEST_USER_ID,
            notification: notifications[1]._id,
            read: true,
        },
        {
            user: TEST_USER_ID,
            notification: notifications[2]._id,
            read: false,
        },
    ]);

    // Seed events for Computer Science Club (all events from useMyClubsData)
    const csClubEvents = [
        {
            club: clubs[0]._id, // Computer Science Club
            name: 'Club Meeting',
            description: 'Monthly club meeting before summer break.',
            type: EventType.CLUB_MEMBERS,
            location: 'Engineering Building Room 205',
            date: '2025-07-25',
            startTime: '15:00',
            endTime: '16:00',
            published: true,
            tags: [eventTagMap['Meeting']],
        },
        {
            club: clubs[0]._id,
            name: 'Month-End Review',
            description: 'Review June accomplishments and July goals.',
            type: EventType.CLUB_MEMBERS,
            location: 'Conference Room A',
            date: '2025-07-30',
            startTime: '16:00',
            endTime: '17:00',
            published: false,
            tags: [eventTagMap['Review'], eventTagMap['Meeting']],
        },
        {
            club: clubs[0]._id,
            name: 'Independence Day Prep',
            description: 'Prepare for July 4th celebration activities.',
            type: EventType.CLUB_MEMBERS,
            location: 'Student Center',
            date: '2025-08-01',
            startTime: '10:00',
            endTime: '12:00',
            published: true,
            tags: [eventTagMap['Preparation'], eventTagMap['Social']],
        },
        {
            club: clubs[0]._id,
            name: 'July Kickoff',
            description: 'Start July with team building activities.',
            type: EventType.CLUB_MEMBERS,
            location: 'Main Hall',
            date: '2025-08-02',
            startTime: '14:00',
            endTime: '16:00',
            published: false,
            tags: [eventTagMap['Social'], eventTagMap['Meeting']],
        },
        {
            club: clubs[0]._id,
            name: 'Coding Workshop',
            description: 'Introduction to React and modern web development.',
            type: EventType.UCSD_STUDENTS,
            location: 'Computer Lab',
            date: '2025-08-08',
            startTime: '14:00',
            endTime: '17:00',
            published: true,
            tags: [eventTagMap['Workshop'], eventTagMap['Educational']],
        },
        {
            club: clubs[0]._id,
            name: 'Photography Workshop',
            description: 'Learn advanced lighting techniques and composition.',
            type: EventType.UCSD_STUDENTS,
            location: 'Art Building Studio 3',
            date: '2025-08-15',
            startTime: '14:00',
            endTime: '16:00',
            published: false,
            tags: [eventTagMap['Workshop'], eventTagMap['Photography']],
        },
        {
            club: clubs[0]._id,
            name: 'Gaming Tournament',
            description: 'Weekly esports tournament with prizes.',
            type: EventType.UCSD_STUDENTS,
            location: 'Game Room',
            date: '2025-08-15',
            startTime: '19:00',
            endTime: '22:00',
            published: true,
            tags: [eventTagMap['Tournament'], eventTagMap['Competition']],
        },
        {
            club: clubs[0]._id,
            name: 'Hackathon Prep',
            description: 'Prepare for upcoming hackathon event.',
            type: EventType.CLUB_MEMBERS,
            location: 'Tech Lab',
            date: '2025-08-22',
            startTime: '13:00',
            endTime: '15:00',
            published: false,
            tags: [eventTagMap['Hackathon'], eventTagMap['Preparation']],
        },
        {
            club: clubs[0]._id,
            name: 'Tech Talk',
            description: 'Guest speaker on AI and machine learning.',
            type: EventType.UCSD_STUDENTS,
            location: 'Auditorium',
            date: '2025-08-22',
            startTime: '16:00',
            endTime: '17:30',
            published: true,
            tags: [eventTagMap['Tech Talk'], eventTagMap['Educational']],
        },
        {
            club: clubs[0]._id,
            name: 'Networking Event',
            description: 'Connect with industry professionals.',
            type: EventType.UCSD_STUDENTS,
            location: 'Business Center',
            date: '2025-08-22',
            startTime: '18:30',
            endTime: '20:00',
            published: true,
            tags: [eventTagMap['Networking'], eventTagMap['Professional']],
        },
        {
            club: clubs[0]._id,
            name: 'Panel Discussion',
            description: 'Panel on career paths in technology.',
            type: EventType.UCSD_STUDENTS,
            location: 'Conference Hall',
            date: '2025-08-22',
            startTime: '20:00',
            endTime: '21:30',
            published: false,
            tags: [eventTagMap['Panel'], eventTagMap['Professional']],
        },
        {
            club: clubs[0]._id,
            name: 'Debate Practice',
            description: 'Practice session for upcoming competition.',
            type: EventType.CLUB_MEMBERS,
            location: 'Debate Hall',
            date: '2025-08-25',
            startTime: '15:00',
            endTime: '17:00',
            published: false,
            tags: [eventTagMap['Debate'], eventTagMap['Competition']],
        },
        {
            club: clubs[0]._id,
            name: 'Summer Fair',
            description: 'Annual summer celebration and fair.',
            requirements: 'Bring a dish/snack to enter the fair!',
            type: EventType.ANYONE,
            location: 'Campus Quad',
            date: '2025-09-01',
            startTime: '11:00',
            endTime: '17:00',
            published: true,
            tags: [eventTagMap['Fair'], eventTagMap['Social']],
        },
        {
            club: clubs[0]._id,
            name: 'Volunteer Day',
            description: 'Community service project.',
            type: EventType.ANYONE,
            location: 'Community Center',
            date: '2025-09-05',
            startTime: '09:00',
            endTime: '15:00',
            published: true,
            tags: [eventTagMap['Volunteer'], eventTagMap['Social']],
        },
    ];

    await Event.insertMany(csClubEvents);

    // Add 2 events for each other club in the same date range
    const otherClubsEvents: any[] = [];

    // For each club except the first one (Computer Science Club)
    for (let i = 1; i < clubs.length; i++) {
        const club = clubs[i];
        otherClubsEvents.push(
            {
                club: club._id,
                name: 'Weekly Workshop',
                description: `Interactive workshop hosted by ${club.name}.`,
                type: EventType.UCSD_STUDENTS,
                location: 'Student Center Room 101',
                date: '2025-08-10',
                startTime: '18:00',
                endTime: '20:00',
                published: false,
                tags: [eventTagMap['Workshop'], eventTagMap['Educational']],
            },
            {
                club: club._id,
                name: 'Social Mixer',
                description: `Meet other members and learn more about ${club.name}.`,
                type: EventType.UCSD_STUDENTS,
                location: 'Campus Quad',
                date: '2025-08-25',
                startTime: '17:00',
                endTime: '19:00',
                published: true,
                tags: [eventTagMap['Social'], eventTagMap['Networking']],
            }
        );
    }

    await Event.insertMany(otherClubsEvents);

    console.log('Seeding complete!');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
});
