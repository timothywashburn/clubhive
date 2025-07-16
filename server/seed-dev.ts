import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Club from './src/models/club-schema';
import School from './src/models/school-schema';
import Tag from './src/models/tag-schema';

async function seed() {
    console.log('Connecting to MongoDB at:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!);
    await School.deleteMany({});
    await Tag.deleteMany({});
    await Club.deleteMany({});

    const [ucsd] = await School.insertMany([
        { name: 'UCSD', location: 'San Diego, CA' },
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
    ]);

    const tagMap = Object.fromEntries(tags.map(t => [t.text, t._id]));

    await Club.insertMany([
        {
            name: 'Computer Science Club',
            tagline: 'Innovate, Code, Collaborate',
            description:
                'A community for students passionate about CS. We host workshops, coding competitions, and networking nights to empower technical growth.',
            url: 'https://csclub.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Technology'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Academic'],
                tagMap['Professional Development'],
                tagMap['STEM'],
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
                'We organize UCSD’s largest hackathons and tech events for students of all levels. Build, learn, and win with us.',
            url: 'https://hackthetriton.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Hackathon'],
                tagMap['Technology'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Professional Development'],
                tagMap['STEM'],
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
                'We foster an inclusive tech environment by connecting and supporting women and non-binary students in computing.',
            url: 'https://wic.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Diversity'],
                tagMap['Technology'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Professional Development'],
                tagMap['Academic'],
                tagMap['STEM'],
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
                'We’re dedicated to local impact through volunteering, food drives, and mentorship programs in San Diego.',
            url: 'https://community.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Community'],
                tagMap['Volunteer'],
                tagMap['Social Impact'],
                tagMap['Service'],
            ],
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
                'Every week, we run hands-on workshops on topics like web dev, machine learning, and game design for all skill levels.',
            url: 'https://workshopcentral.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Workshop'],
                tagMap['Technology'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Professional Development'],
                tagMap['Academic'],
                tagMap['STEM'],
            ],
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
                'Our mission is to support student founders through mentorship, pitch events, and venture capital connections.',
            url: 'https://startupcircle.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Entrepreneurship'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Professional Development'],
                tagMap['Academic'],
            ],
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
                'We bring together casual and competitive gamers for tournaments, LAN parties, and game dev meetups.',
            url: 'https://gamers.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Gaming'],
                tagMap['Community'],
                tagMap['Social'],
                tagMap['Esports'],
                tagMap['Technology'],
            ],
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
                'Our club celebrates creativity across mediums—film, photography, poetry, and music—through exhibitions and collabs.',
            url: 'https://creatives.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Arts & Culture'],
                tagMap['Community'],
                tagMap['Social Impact'],
                tagMap['Media & Journalism'],
            ],
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
                'We promote ethical and inclusive data practices through workshops, speakers, and open-source projects.',
            url: 'https://diversitydata.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Diversity'],
                tagMap['Workshop'],
                tagMap['Technology'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Professional Development'],
                tagMap['Academic'],
                tagMap['STEM'],
            ],
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
                'We host weekly info sessions with recruiters and engineers from top tech companies to help you break into the field.',
            url: 'https://infosessions.ucsd.edu',
            school: ucsd._id,
            tags: [
                tagMap['Info Session'],
                tagMap['Career'],
                tagMap['Community'],
                tagMap['Professional Development'],
                tagMap['Academic'],
                tagMap['STEM'],
            ],
            socials: {
                website: 'https://infosessions.ucsd.edu',
                discord: '',
                instagram: '',
            },
        },
    ]);

    console.log('Seeding complete.');
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
