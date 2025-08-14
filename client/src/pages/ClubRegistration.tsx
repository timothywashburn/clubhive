import { useClubTagsData } from '../hooks/fetchClubTags';
import { useSchoolData } from '../hooks/fetchSchools';
import React, { useState } from 'react';
import { TagSelectionPopup } from '../features/find-clubs/components/TagsSelectionPopup';
import type { TagData } from '@clubhive/shared';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import { createClubRequestSchema } from '@clubhive/shared/src/types/club-types';
import { useToast } from '../hooks/useToast';

export function ClubRegistration() {
    const { tags } = useClubTagsData();
    const { schools } = useSchoolData();
    const [selectedTags, setSelectedTags] = useState<TagData[]>([]);

    const inputClass =
        'mt-1 block w-full rounded-md text-on-primary-container border bg-surface px-3 py-2 shadow-sm ' +
        'focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 focus:outline-none';
    const prefixClass =
        'mt-1 inline-flex items-center px-3 py-2 text-sm text-on-primary-container bg-surface-variant border border-outline-variant rounded-l-md';

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

    const { errorToast } = useToast();
    const { successToast } = useToast();

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
            // Flatten errors and show as toasts
            const zodErrors = result.error.format();
            console.log('Full Zod errors:', zodErrors);

            if (zodErrors.name?._errors.length) errorToast(zodErrors.name._errors[0]);
            if (zodErrors.school?._errors.length) errorToast(zodErrors.school._errors[0]);
            if (zodErrors.url?._errors.length) errorToast(zodErrors.url._errors[0]);
            if (zodErrors.tagline?._errors.length) errorToast(zodErrors.tagline._errors[0]);
            if (zodErrors.description?._errors.length) errorToast(zodErrors.description._errors[0]);

            // Handle nested socials errors
            if (zodErrors.socials?.discord?._errors.length) errorToast(zodErrors.socials.discord._errors[0]);
            if (zodErrors.socials?.instagram?._errors.length) errorToast(zodErrors.socials.instagram._errors[0]);
            if (zodErrors.socials?.website?._errors.length) errorToast(zodErrors.socials.website._errors[0]);

            return;
        }

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
                successToast('Club registered successfully!');
            }
        } catch (error) {
            console.error('Error registering club:', error);
            errorToast('Failed to register club. Please try again.');
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

                            {/* Name and School */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="club-name" className="block text-sm font-medium text-on-background">
                                        Club Name <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="club-name"
                                        className={inputClass + ' border-outline-variant'}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-school" className="block text-sm font-medium text-on-background">
                                        School <span className="text-error">*</span>
                                    </label>
                                    <select
                                        id="club-school"
                                        className={inputClass + ' border-outline-variant'}
                                        value={school}
                                        onChange={e => setSchool(e.target.value)}
                                    >
                                        <option value="" disabled>
                                            Select your school
                                        </option>
                                        {schools.map(school => (
                                            <option key={school._id} value={school._id}>
                                                {school.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* URL */}
                            <div className="mt-5">
                                <label htmlFor="club-url" className="block text-sm font-medium text-on-background">
                                    Profile Page URL
                                </label>
                                <div className="flex">
                                    <span className={prefixClass + ' whitespace-nowrap'}>https://clubhive.timothyw.dev/club-profile/</span>
                                    <input
                                        placeholder="your-club-profile-url"
                                        type="text"
                                        id="club-url"
                                        className={inputClass + ' rounded-none rounded-r-md border-outline-variant'}
                                        value={url}
                                        onChange={e => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-5 grid grid-row-3 gap-6">
                                <div>
                                    <label htmlFor="club-discord" className="block text-sm font-medium text-on-background">
                                        Discord Invite Link
                                    </label>
                                    <div className="flex">
                                        <span className={prefixClass}>https://discord.com/invite/</span>
                                        <input
                                            placeholder="your-club-invite"
                                            type="text"
                                            id="club-discord"
                                            className={inputClass + ' rounded-none rounded-r-md border-outline-variant'}
                                            value={discord}
                                            onChange={e => setDiscord(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="club-instagram" className="block text-sm font-medium text-on-background">
                                        Instagram Profile Link
                                    </label>
                                    <div className="flex">
                                        <span className={prefixClass}>https://www.instagram.com/</span>
                                        <input
                                            placeholder="your-club-account"
                                            type="text"
                                            id="club-instagram"
                                            className={inputClass + ' rounded-none rounded-r-md border-outline-variant'}
                                            value={instagram}
                                            onChange={e => setInstagram(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="club-website" className="block text-sm font-medium text-on-background">
                                        Website Link
                                    </label>
                                    <div className="flex">
                                        <span className={prefixClass}>https://</span>
                                        <input
                                            placeholder="your-club-website"
                                            type="text"
                                            id="club-website"
                                            className={inputClass + ' rounded-none rounded-r-md border-outline-variant'}
                                            value={website}
                                            onChange={e => setWebsite(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tagline */}
                            <div className="mt-5">
                                <label htmlFor="club-tagline" className="block text-sm font-medium text-on-background">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    id="club-tagline"
                                    className={inputClass + ' border-outline-variant'}
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

                            {/* Description */}
                            <div>
                                <label htmlFor="club-description" className="block text-sm font-medium text-on-background">
                                    Description
                                </label>
                                <textarea
                                    id="club-description"
                                    rows={4}
                                    className={inputClass + ' border-outline-variant'}
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
