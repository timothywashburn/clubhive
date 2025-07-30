import { Link } from 'react-router';
import React, { useState, useEffect } from 'react';
import TagFilterPopover from '../features/find-clubs/components/FilterTagsButton';
import type { Tag } from '../hooks/fetchTags';
import { useTagsData } from '../hooks/fetchTags';
import { getTagColor } from '../features/find-clubs/utils/TagColors';

export function Events() {
    const [searchTerm, setSearchTerm] = useState('');
    const { tags } = useTagsData();
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                const data = await res.json();
                console.log('Fetch result:', data);
                if (data.success) {
                    setEvents(Array.isArray(data.events) ? data.events : []);
                    console.log('Fetched events full data:', data);
                    console.log('Fetched events:', data.events);
                } else {
                    console.warn('No events array in response');
                    setEvents([]);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = Array.isArray(events)
        ? events
              .filter(event => event.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              .filter(event => selectedTags.length === 0 || selectedTags.every(tag => event.tags?.includes(tag)))
              .filter(event => {
                  if (!date) return true;
                  const selected = new Date(date);
                  const eventDate = new Date(event.date);
                  if (selected.getFullYear() !== eventDate.getFullYear()) return false;
                  if (date.length <= 4) return true;
                  if (selected.getMonth() !== eventDate.getMonth()) return false;
                  if (date.length <= 7) return true;
                  return selected.getDate() === eventDate.getDate();
              })
              .filter(event => location.trim() === '' || event.location?.toLowerCase().includes(location.toLowerCase()))
        : [];

    return (
        <div className="h-full relative">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface">Events</h1>
                    <p className="text-on-surface-variant mt-2">Discover upcoming events from clubs you follow</p>
                </div>

                {/* search bar */}
                <div className="flex h-10 mb-6">
                    <TagFilterPopover tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border text-on-surface border-outline-variant rounded-md leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full sm:w-auto pl-3 pr-3 py-2 border text-on-surface border-outline-variant rounded-md bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="pl-3 pr-3 py-2 border text-on-surface border-outline-variant rounded-md bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
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

                <hr className="my-4 border-t border-outline-variant" />
                <div className="space-y-6 mt-6">
                    {/* event cards */}
                    {filteredEvents.map(event => (
                        <div key={event._id} className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-primary font-bold text-sm">C</span>
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-medium text-on-surface">
                                                <Link to={`/club-profile/${event.club?.url}`} className="text-primary hover:underline mr-1">
                                                    {event.club?.name}
                                                </Link>
                                                <span className="text-primary mr-1">: </span>
                                                <Link to={`/events/${event._id}`} className="text-primary hover:underline mr-1">
                                                    {`${event.name}`}
                                                </Link>
                                            </h2>
                                            <p className="text-sm text-on-surface-variant">{event.clubName}</p>
                                        </div>
                                    </div>

                                    {/* event description */}
                                    <p className="text-on-surface-variant mb-4">{event.description || 'Join use for an exciting event!'}</p>

                                    {/* event tags */}
                                    <div className="text-sm text-on-surface-variant flex flex-wrap gap-2 mt-2 mb-4">
                                        {event.tags
                                            ?.filter(tag => tag !== null && typeof tag === 'object')
                                            .map(tag => (
                                                <span
                                                    key={tag.idx}
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagColor(tag._id)}`}
                                                >
                                                    {tag.text}
                                                </span>
                                            ))}
                                    </div>

                                    {/* date, time, location */}
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
                                            {event.startTime || 'TBD'}
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
