import mongoose from 'mongoose';

import Club from '../server/src/models/club-schema';
import School from '../server/src/models/school-schema';
import Tag from '../server/src/models/tag-schema';

async function seed() {
    await mongoose.connect('mongodb://vps.timothyw.dev:30018/clubhive');

    // school
    const [ucsd] = await School.insertMany([
        { name: 'UCSD', location: 'San Diego, CA' },
    ]);

    // tags
    const tags = await Tag.insertMany([
        { type: 'club', text: 'Technology' },
        { type: 'club', text: 'Career' },
        { type: 'event', text: 'Hackathon' },
        { type: 'club', text: 'Community' },
        { type: 'club', text: 'Diversity' },
        { type: 'event', text: 'Workshop' },
    ]);

    // clubs
    await Club.insertMany([
        {
            name: 'Computer Science Club',
            tagline: 'Innovate, Code, Collaborate',
            description:
                'A club for students passionate about computer science.',
            url: 'https://csclub.ucsd.edu',
            school: ucsd._id,
            tags: [tags[0]._id, tags[1]._id],
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
                'The team behind UCSD’s biggest student-run hackathons.',
            url: 'https://hackthetriton.ucsd.edu',
            school: ucsd._id,
            tags: [tags[2]._id, tags[0]._id],
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
                'Creating inclusive spaces for women and non-binary students in CS.',
            url: 'https://wic.ucsd.edu',
            school: ucsd._id,
            tags: [tags[4]._id, tags[0]._id],
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
                'Focused on outreach and service to the greater San Diego area.',
            url: 'https://community.ucsd.edu',
            school: ucsd._id,
            tags: [tags[3]._id],
            socials: {
                website: 'https://community.ucsd.edu',
                discord: '',
                instagram: '',
            },
        },
        {
            name: 'Workshop Central',
            tagline: 'Learn and Build, Weekly',
            description: 'Hands-on workshops every week to build your skills.',
            url: 'https://workshopcentral.ucsd.edu',
            school: ucsd._id,
            tags: [tags[5]._id, tags[0]._id],
            socials: {
                website: 'https://workshopcentral.ucsd.edu',
                discord: 'https://discord.gg/workshops',
                instagram: 'https://instagram.com/workshopcentral',
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
