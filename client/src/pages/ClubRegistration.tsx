import { useTagsData } from '../hooks/fetchTags';
import React, { useState } from 'react';
import { TagSelectionPopup } from '../features/find-clubs/components/TagsSelectionPopup';
import type { TagData } from '@clubhive/shared';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import { createClubRequestSchema } from '@clubhive/shared/src/types/club-types';

export function ClubRegistration() {
    const { tags } = useTagsData();
    const [selectedTags, setSelectedTags] = useState<TagData[]>([]);

    const inputClass =
        'mt-1 block w-full rounded-md text-on-primary-container border border-outline-variant bg-surface px-3 py-2 shadow-sm ' +
        'focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:outline-none';

    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [tagline, setTagline] = useState('');
    const [url, setUrl] = useState('');
    const [discord, setDiscord] = useState('');
    const [instagram, setInstagram] = useState('');
    const [website, setWebsite] = useState('');
    const [description, setDescription] = useState('');

    const maxDescriptionLength = 1000;
    const maxTaglineLength = 50;

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const clubData = {
            name: name,
            school: school,
            tagline: tagline || undefined,
            url: url || undefined,
            socials: {
                discord: discord || undefined,
                instagram: instagram || undefined,
                website: website || undefined,
            },
            description: description || undefined,
            tags: selectedTags.map(tag => tag._id) || undefined,
            clubLogo: undefined,
            pictures: undefined,
        };

        // Validate using Zod schema
        const result = createClubRequestSchema.safeParse(clubData);

        if (!result.success) {
            // Flatten errors
            const zodErrors = result.error.format();
            console.log('Full Zod errors:', zodErrors);

            const newErrors: { [key: string]: string } = {};

            if (zodErrors.name?._errors.length) newErrors.name = zodErrors.name._errors[0];
            if (zodErrors.school?._errors.length) newErrors.school = zodErrors.school._errors[0];

            setErrors(newErrors);
            return;
        }

        setErrors({});

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
                                        className={inputClass + ' ' + (errors.name ? 'border-error' : '')}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="club-school" className="block text-sm font-medium text-on-background">
                                        School
                                    </label>
                                    <select
                                        id="club-school"
                                        className={inputClass + ' ' + (errors.school ? 'border-error' : '')}
                                        value={school}
                                        onChange={e => setSchool(e.target.value)}
                                    >
                                        <option className="text-on-background-variant" value="">
                                            Select your school
                                        </option>
                                        <option value="UCSD">UCSD</option>
                                    </select>
                                    {errors.school && <p className="text-error text-sm mt-1">{errors.school}</p>}
                                </div>
                                <div>
                                    <label htmlFor="club-tagline" className="block text-sm font-medium text-on-background">
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        id="club-tagline"
                                        className={inputClass}
                                        value={tagline}
                                        onChange={e => {
                                            if (e.target.value.length <= maxTaglineLength) {
                                                setTagline(e.target.value);
                                            }
                                        }}
                                    />
                                    <div className="text-right text-sm text-gray-500 mt-1">
                                        {tagline.length} / {maxTaglineLength}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="club-url" className="block text-sm font-medium text-on-background">
                                        Profile Page URL
                                    </label>
                                    <input
                                        type="text"
                                        id="club-url"
                                        className={inputClass}
                                        value={url}
                                        onChange={e => setUrl(e.target.value)}
                                    />
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
                                        className={inputClass}
                                        value={discord}
                                        onChange={e => setDiscord(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-instagram" className="block text-sm font-medium text-on-background">
                                        Instagram Profile Link
                                    </label>
                                    <input
                                        placeholder="https://www.instagram.com/..."
                                        type="text"
                                        id="club-instagram"
                                        className={inputClass}
                                        value={instagram}
                                        onChange={e => setInstagram(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-website" className="block text-sm font-medium text-on-background">
                                        Website Link
                                    </label>
                                    <input
                                        type="text"
                                        id="club-website"
                                        className={inputClass}
                                        value={website}
                                        onChange={e => setWebsite(e.target.value)}
                                    />
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
                                    value={description}
                                    onChange={e => {
                                        if (e.target.value.length <= maxDescriptionLength) {
                                            setDescription(e.target.value);
                                        }
                                    }}
                                />
                                <div className="text-right text-sm text-gray-500 mt-1">
                                    {description.length} / {maxDescriptionLength}
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
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-on-primary bg-primary hover:cursor-pointer"
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
