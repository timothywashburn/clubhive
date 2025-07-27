import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
import TagFilterPopover from '../features/find-clubs/components/FilterTagsButton';
import type { Tag } from '../hooks/fetchTags';
import { useTagsData } from '../hooks/fetchTags';
import { getTagColor } from '../features/find-clubs/utils/TagColors';

/**
 * THIS CLASS IS AI GENERATED AND TEMPORARY
 *
 * This class is a placeholder that bears no resemblance to the real
 * implementation for this page. This code is temporary and can be
 * replaced by the real implementation at any time.
 */
export function Events() {
    const [searchTerm, setSearchTerm] = useState('');
    const { tags } = useTagsData();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const tagMap = Object.fromEntries(tags.map(t => [t.text, t._id]));

    const [events, setEvents] = useState<any[]>([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                const data = await res.json();
                if (data.success) {
                    setEvents(Array.isArray(data.data.events) ? data.data.events : []);
                    console.log('Fetched events:', data.data);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = Array.isArray(events)
        ? events
              .filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .filter(event => selectedTags.length === 0 || selectedTags.every(tag => event.tags?.includes(tag)))
        : [];

    console.log('Filtered events:', filteredEvents);

    return (
        <div className="h-full relative">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface">Events</h1>
                    <p className="text-on-surface-variant mt-2">Discover upcoming events from clubs you follow</p>
                </div>

                <div className="flex h-10 mb-6">
                    <TagFilterPopover tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border text-on-surface border-outline-variant rounded-md leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-3">
                    {selectedTags.map(tag => (
                        <span
                            key={tag._id}
                            className={`rounded-full px-3 py-1 text-xs font-semibold hover:cursor-pointer ${getTagColor(tag._id)}`}
                            onClick={() => setSelectedTags(selectedTags.filter(t => t._id !== tag._id))}
                        >
                            {tag.text}
                        </span>
                    ))}
                </div>

                <div className="space-y-6 mt-6">
                    {/* Placeholder event cards */}
                    {filteredEvents.map(event => (
                        <div key={event._id} className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-primary font-bold text-sm">C</span>
                                        </div>
                                        <div>
                                            <Link to={`/events/${event._id}`} className="text-lg font-medium text-primary hover:underline">
                                                {event.name || 'Event'}
                                            </Link>

                                            {/*<h3 className="text-lg font-medium text-on-surface">
                                                Event {i}
                                            </h3>*/}

                                            <p className="text-sm text-on-surface-variant">{event.clubName}</p>
                                        </div>
                                    </div>
                                    <p className="text-on-surface-variant mb-4">{event.description || 'Join use for an exciting event!'}</p>
                                    <div className="flex items-center text-sm text-on-surface-variant space-x-4">
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {event.time || 'TBD'}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            {event.location || 'TBD'}
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 font-medium">
                                    RSVP
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
