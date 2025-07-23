import FilterTagsButton from '../features/find-clubs/components/FilterTagsButton';
import { useTagsData } from '../hooks/fetchTags';
import { Tag } from '../hooks/fetchTags';
import { useState } from 'react';
export function ClubRegistration() {
    const { tags } = useTagsData();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    return (
        <div className="h-full relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-background">Register Your Club</h1>
                    <p className="text-on-background-variant mt-2">Fill out the form below to register your club.</p>
                    <div className="bg-surface rounded-lg shadow p-6 mt-4">
                        <form className="overflow-y-auto">
                            <h2 className="text-xl font-semibold text-on-background mb-4">Club Information</h2>
                            <div
                                className={`w-30 h-30 rounded-full flex items-center justify-center text-sm font-semibold bg-primary-container text-primary`}
                            >
                                <img src="/ucsd-logo.png" alt="insert logo" className="w-30 h-30 object-cover rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="club-name" className="block text-sm font-medium text-on-background">
                                        Club Name
                                    </label>
                                    <input
                                        type="text"
                                        id="club-name"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-school" className="block text-sm font-medium text-on-background">
                                        School
                                    </label>
                                    <input
                                        type="text"
                                        id="club-school"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-tagline" className="block text-sm font-medium text-on-background">
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        id="club-tagline"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-url" className="block text-sm font-medium text-on-background">
                                        URL
                                    </label>
                                    <input
                                        type="text"
                                        id="club-url"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="club-discord" className="block text-sm font-medium text-on-background">
                                        Discord
                                    </label>
                                    <input
                                        type="text"
                                        id="club-discord"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-instagram" className="block text-sm font-medium text-on-background">
                                        Instagram
                                    </label>
                                    <input
                                        type="text"
                                        id="club-instagram"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="club-website" className="block text-sm font-medium text-on-background">
                                        Website
                                    </label>
                                    <input
                                        type="text"
                                        id="club-website"
                                        className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                    />
                                </div>
                            </div>

                            <div className="mt-5">
                                <label htmlFor="club-description" className="block text-sm font-medium text-on-background">
                                    Description
                                </label>
                                <textarea
                                    id="club-description"
                                    rows={4}
                                    className="mt-1 block w-full border border-on-background-variant rounded-md shadow-sm focus:ring focus:ring-on-background"
                                ></textarea>
                            </div>
                            <FilterTagsButton tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
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
