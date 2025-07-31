import { useTagsData } from '../hooks/fetchTags';
import React, { useState } from 'react';
import { TagSelectionPopup } from '../features/find-clubs/components/TagsSelectionPopup';
import type { TagData } from '@clubhive/shared';
import { getTagColor } from '../features/find-clubs/utils/TagColors';

export function ClubRegistration() {
    const { tags } = useTagsData();
    const [selectedTags, setSelectedTags] = useState<TagData[]>([]);

    const inputClass =
        'mt-1 block w-full rounded-md text-on-primary-container border border-outline-variant bg-surface px-3 py-2 shadow-sm ' +
        'focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:outline-none';

    const [clubName, setClubName] = useState('');
    const [clubSchool, setClubSchool] = useState('');
    const [clubTagline, setClubTagline] = useState('');
    const [clubUrl, setClubUrl] = useState('');
    const [clubDiscord, setClubDiscord] = useState('');
    const [clubInstagram, setClubInstagram] = useState('');
    const [clubWebsite, setClubWebsite] = useState('');
    const [clubDescription, setClubDescription] = useState('');

    const maxDescriptionLength = 1000;
    const maxTaglineLength = 50;

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const newErrors: { [key: string]: string } = {};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clubName) newErrors.clubName = 'Club name is required';
        if (!clubSchool) newErrors.clubSchool = 'School is required';
        if (!clubUrl) newErrors.clubUrl = 'URL is required';
        if (clubDiscord && !clubDiscord.startsWith('https://discord.com/invite'))
            newErrors.clubDiscord = 'Discord link must start with https://discord.com/invite/';
        if (clubInstagram && !clubInstagram.startsWith('https://www.instagram.com/'))
            newErrors.clubInstagram = 'Instagram link must start with https://www.instagram.com/';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const clubData = {
            name: clubName,
            school: clubSchool,
            tagline: clubTagline ? clubTagline : '',
            url: clubUrl,
            discord: clubDiscord,
            instagram: clubInstagram,
            website: clubWebsite,
            description: clubDescription ? clubDescription : '',
            tags: selectedTags.map(tag => tag._id),
        };

        try {
            const res = await fetch('/api/clubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(clubData),
            });
            const result = await res.json();
            if (result.success) {
                console.log('Club registered successfully:', result.club);
            }
        } catch (error) {
            console.error('Error registering club:', error);
        }
    };

    return (
        <div className="h-full relative z-1">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-background">Register Your Club</h1>
                    <p className="text-on-background-variant mt-2">Fill out the form below to register your club to clubhive.</p>
                    <div className="bg-surface rounded-lg shadow p-6 mt-4">
                        <form onSubmit={handleSubmit} className="overflow-y-auto">
                            <h2 className="text-xl font-semibold text-on-background mb-4">Club Information</h2>
                            <hr className="my-4 border-t border-outline-variant" />

                            {/* Club Details */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="club-name" className="block text-sm font-medium text-on-background">
                                        Club Name
                                    </label>
                                    <input
                                        type="text"
                                        id="club-name"
                                        className={inputClass + ' ' + (errors.clubName ? 'border-red-500' : '')}
                                        value={clubName}
                                        onChange={e => setClubName(e.target.value)}
                                    />
                                    {errors.clubName && <p className="text-red-500 text-sm mt-1">{errors.clubName}</p>}
                                </div>
                                <div>
                                    <label htmlFor="club-school" className="block text-sm font-medium text-on-background">
                                        School
                                    </label>
                                    <select
                                        id="club-school"
                                        className={inputClass + ' ' + (errors.clubSchool ? 'border-red-500' : '')}
                                        value={clubSchool}
                                        onChange={e => setClubSchool(e.target.value)}
                                    >
                                        <option value="UCSD">UCSD</option>
                                        <option value="UCLA">UCLA</option>
                                        <option value="UCI">UCI</option>
                                        <option value="UCSB">UCSB</option>
                                        <option value="UCR">UCR</option>
                                    </select>
                                    {errors.clubSchool && <p className="text-red-500 text-sm mt-1">{errors.clubSchool}</p>}
                                </div>
                                <div>
                                    <label htmlFor="club-tagline" className="block text-sm font-medium text-on-background">
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        id="club-tagline"
                                        className={inputClass}
                                        value={clubTagline}
                                        onChange={e => {
                                            if (e.target.value.length <= maxTaglineLength) {
                                                setClubTagline(e.target.value);
                                            }
                                        }}
                                    />
                                    <div className="text-right text-sm text-gray-500 mt-1">
                                        {clubTagline.length} / {maxTaglineLength}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="club-url" className="block text-sm font-medium text-on-background">
                                        Profile Page URL
                                    </label>
                                    <input
                                        type="text"
                                        id="club-url"
                                        className={inputClass + ' ' + (errors.clubUrl ? 'border-red-500' : '')}
                                        value={clubUrl}
                                        onChange={e => setClubUrl(e.target.value)}
                                    />
                                    {errors.clubUrl && <p className="text-red-500 text-sm mt-1">{errors.clubUrl}</p>}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-5 grid grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="club-discord" className="block text-sm font-medium text-on-background">
                                        Discord Invite Link
                                    </label>
                                    <input
                                        placeholder="https://discord.com/invite/..."
                                        type="text"
                                        id="club-discord"
                                        className={inputClass + ' ' + (errors.clubDiscord ? 'border-red-500' : '')}
                                        value={clubDiscord}
                                        onChange={e => setClubDiscord(e.target.value)}
                                    />
                                    {errors.clubDiscord && <p className="text-red-500 text-sm mt-1">{errors.clubDiscord}</p>}
                                </div>
                                <div>
                                    <label htmlFor="club-instagram" className="block text-sm font-medium text-on-background">
                                        Instagram Profile Link
                                    </label>
                                    <input
                                        placeholder="https://www.instagram.com/..."
                                        type="text"
                                        id="club-instagram"
                                        className={inputClass + ' ' + (errors.clubInstagram ? 'border-red-500' : '')}
                                        value={clubInstagram}
                                        onChange={e => setClubInstagram(e.target.value)}
                                    />
                                    {errors.clubInstagram && <p className="text-red-500 text-sm mt-1">{errors.clubInstagram}</p>}
                                </div>
                                <div>
                                    <label htmlFor="club-website" className="block text-sm font-medium text-on-background">
                                        Website Link
                                    </label>
                                    <input
                                        type="text"
                                        id="club-website"
                                        className={inputClass + ' ' + (errors.clubWebsite ? 'border-red-500' : '')}
                                        value={clubWebsite}
                                        onChange={e => setClubWebsite(e.target.value)}
                                    />
                                    {errors.clubWebsite && <p className="text-red-500 text-sm mt-1">{errors.clubWebsite}</p>}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-5">
                                <label htmlFor="club-description" className="block text-sm font-medium text-on-background">
                                    Description
                                </label>
                                <textarea
                                    id="club-description"
                                    rows={4}
                                    className={inputClass}
                                    value={clubDescription}
                                    onChange={e => {
                                        if (e.target.value.length <= maxDescriptionLength) {
                                            setClubDescription(e.target.value);
                                        }
                                    }}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {clubDescription.length} / {maxDescriptionLength}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mt-5">
                                <label className="block text-sm font-medium text-on-background">Tags</label>
                                <TagSelectionPopup tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} inline />
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedTags.map(tag => (
                                        <span
                                            key={tag._id}
                                            className={`px-2 py-1 rounded-full text-xs ${getTagColor(tag._id)}`}
                                            onClick={() => setSelectedTags(selectedTags.filter(t => t._id !== tag._id))}
                                        >
                                            {tag.text}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-on-primary bg-primary hover:bg-on-background-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-on-background"
                                >
                                    Register Club
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
