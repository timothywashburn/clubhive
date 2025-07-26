import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Club from './src/models/club-schema';
import School from './src/models/school-schema';
import Tag from './src/models/tag-schema';
import Event from './src/models/event-schema';
import { EventType } from './src/models/event-schema';

dotenv.config({ path: '.env' });
// dotenv.config({ path: '.env.local' });

async function seed() {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!);
    await School.deleteMany({});
    await Tag.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});

    const [ucsd] = await School.insertMany([{ name: 'UCSD', location: 'San Diego, CA' }]);

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
    ]);

    const tagMap = Object.fromEntries(tags.map(t => [t.text, t._id]));

    await Club.insertMany([
        {
            name: 'Computer Science Club',
            tagline: 'Innovate, Code, Collaborate',
            description:
                'The Computer Science Club at UCSD is a dynamic community for students who are passionate about coding, software engineering, and emerging technologies. From hands-on coding workshops and competitive hackathons to resume reviews and tech talks with industry professionals, we aim to provide a space where every aspiring developer can grow. Whether you’re just starting out or looking to deepen your technical expertise, CSC helps you connect, collaborate, and create.',
            url: 'cs-club',
            school: ucsd._id,
            tags: [
                tagMap['Technology'],
                tagMap['Academic'],
                tagMap['Professional Development'],
                tagMap['STEM'],
                tagMap['Career'],
                tagMap['Coding'],
            ],
            socials: {
                website: 'https://csclub.ucsd.edu',
                discord: 'https://discord.gg/csclub',
                instagram: 'https://instagram.com/csclub',
            },
            clubLogo: null,
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
                tagMap['Technology'],
                tagMap['Entrepreneurship'],
                tagMap['Professional Development'],
                tagMap['STEM'],
                tagMap['Career'],
                tagMap['Coding'],
            ],
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
                tagMap['Diversity'],
                tagMap['Technology'],
                tagMap['Professional Development'],
                tagMap['Academic'],
                tagMap['STEM'],
                tagMap['Career'],
                tagMap['Coding'],
            ],
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
            tags: [tagMap['Service'], tagMap['Community'], tagMap['Leadership']],
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
            tags: [tagMap['Technology'], tagMap['Academic'], tagMap['STEM'], tagMap['Career']],
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
            tags: [tagMap['Entrepreneurship'], tagMap['Career'], tagMap['Leadership']],
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
            tags: [tagMap['Gaming & Esports'], tagMap['Community'], tagMap['Social'], tagMap['Technology']],
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
            tags: [tagMap['Art'], tagMap['Music'], tagMap['Media & Journalism'], tagMap['Community']],
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
            tags: [tagMap['Diversity'], tagMap['STEM'], tagMap['Technology'], tagMap['Academic']],
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
            tags: [tagMap['Career'], tagMap['Professional Development'], tagMap['STEM']],
            socials: {
                website: 'https://infosessions.ucsd.edu',
                discord: '',
                instagram: '',
            },
        },
    ]);

    const wic = await Club.findOne({ name: 'Women in Computing' });
    if (!wic) {
        throw new Error('Could not find club: Women in Computing');
    }

    const events = await Event.insertMany([
        {
            club: wic._id,
            name: 'First GBM!',
            description: 'Welcome everyone to our first general body meeting!',
            type: EventType.ANYONE,
            location: 'Qualcomm Panel Room',
            date: new Date('2025-10-01'),
            startTime: '18:30:00',
            endTime: '20:00:00',
            picture: null,
            tags: [tagMap['Career'], tagMap['STEM'], tagMap['Social']],
        },
    ]);

    console.log('Seeding complete!');
    mongoose.connection.close();
}

seed().catch(err => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
});
