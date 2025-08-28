import { Link } from 'react-router';
import React, { useState, useRef, useEffect } from 'react';
import TagFilterPopover from '../features/find-clubs/components/FilterTagsButton';
import { ApiResponseBody, EventData, GetEventsResponse, isSuccess, TagData } from '@clubhive/shared';
import { useEventTagsData } from '../hooks/useEventTagsData.ts';
import { getTagColor } from '../features/find-clubs/utils/TagColors';
import { useToast } from '../hooks/useToast.ts';
import WebDatePicker from '../components/date-picker/WebDatePicker';
import { ClubData } from '@clubhive/shared';

interface EventWithClub {
    event: EventData;
    club: ClubData;
}

function TimeFilter({
    afterTime,
    beforeTime,
    setAfterTime,
    setBeforeTime,
}: {
    afterTime: string;
    beforeTime: string;
    setAfterTime: (value: string) => void;
    setBeforeTime: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Validate and format time string (HH:MM in 24-hour format)
    const validateTimeString = (timeStr: string): string => {
        // Remove any non-digit or colon characters
        const cleaned = timeStr.replace(/[^0-9:]/g, '');

        // Allow empty string
        if (cleaned.length === 0) return '';

        // Don't auto-format while typing - just validate limits
        if (cleaned.includes(':')) {
            const [hours, minutes] = cleaned.split(':');

            // Validate hours (0-23)
            if (hours && parseInt(hours) > 23) {
                return cleaned.substring(0, cleaned.length - 1); // Remove last character
            }

            // Validate minutes (0-59)
            if (minutes && parseInt(minutes) > 59) {
                return cleaned.substring(0, cleaned.length - 1); // Remove last character
            }
        } else {
            // Just numbers, no colon yet
            if (cleaned.length <= 2) {
                // Allow up to 2 digits for hours
                if (parseInt(cleaned) > 23) {
                    return cleaned.substring(0, 1); // Keep only first digit
                }
            }
        }

        return cleaned;
    };

    const handleTimeChange = (value: string, setter: (value: string) => void) => {
        const formatted = validateTimeString(value);
        setter(formatted);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="px-3 py-2 border border-outline-variant bg-surface text-on-surface rounded-md rounded-l-none focus:outline-none focus:ring-primary focus:ring-1 h-10 min-w-[100px] whitespace-nowrap"
            >
                Time
            </button>
            {open && (
                <div className="absolute z-50 mt-2 bg-surface border border-outline-variant rounded-md shadow-lg p-3 space-y-2 right-0">
                    <label className="block text-sm text-on-surface">
                        After:
                        <input
                            type="text"
                            value={afterTime}
                            onChange={e => handleTimeChange(e.target.value, setAfterTime)}
                            placeholder="00:00"
                            maxLength={5}
                            className="mt-1 block w-full border text-on-surface border-outline-variant rounded-md bg-surface focus:outline-none focus:ring-primary focus:ring-1 px-2 py-1"
                        />
                    </label>
                    <label className="block text-sm text-on-surface">
                        Before:
                        <input
                            type="text"
                            value={beforeTime}
                            onChange={e => handleTimeChange(e.target.value, setBeforeTime)}
                            placeholder="23:59"
                            maxLength={5}
                            className="mt-1 block w-full border text-on-surface border-outline-variant rounded-md bg-surface focus:outline-none focus:ring-primary focus:ring-1 px-2 py-1"
                        />
                    </label>
                </div>
            )}
        </div>
    );
}

export function EventSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const { tags } = useEventTagsData();
    const [selectedTags, setSelectedTags] = useState<TagData[]>([]);
    const [date, setDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [location, setLocation] = useState('');
    const [events, setEvents] = useState<EventWithClub[]>([]);
    const [afterTime, setAfterTime] = useState('');
    const [beforeTime, setBeforeTime] = useState('');
    const datePickerRef = useRef<HTMLDivElement>(null);

    const { errorToast } = useToast();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                const data: ApiResponseBody<GetEventsResponse> = await res.json();
                if (isSuccess(data)) {
                    setEvents(Array.isArray(data.events) ? data.events : []);
                } else {
                    errorToast(`Error: ${data.error.message}`);
                    setEvents([]);
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setEvents([]);
            }
        };
        fetchEvents();
    }, []);

    // Close date picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredEvents = Array.isArray(events)
        ? events
              .filter(({ event }) => event.name?.toLowerCase().includes(searchTerm.toLowerCase()))
              .filter(
                  ({ event }) =>
                      selectedTags.length === 0 ||
                      selectedTags.every(selectedTag => event.tags?.some(eventTag => eventTag._id === selectedTag._id))
              )
              .filter(({ event }) => {
                  if (!date) return true;
                  const eventDate = new Date(event.date);
                  return (
                      eventDate.getFullYear() === date.getFullYear() &&
                      eventDate.getMonth() === date.getMonth() &&
                      eventDate.getDate() === date.getDate()
                  );
              })
              .filter(({ event }) => location.trim() === '' || event.location?.toLowerCase().includes(location.toLowerCase()))
              .filter(({ event }) => {
                  if (!afterTime && !beforeTime) return true;
                  const eventTime = event.startTime || '00:00';
                  if (afterTime && eventTime < afterTime) return false;
                  if (beforeTime && eventTime > beforeTime) return false;

                  return true;
              })
              .filter(({ event }) => {
                  const eventDateTime = new Date(event.date + 'T' + (event.startTime || '00:00'));
                  return eventDateTime.getTime() >= Date.now();
              })
              .sort((a, b) => {
                  const dateA = new Date(a.event.date + 'T' + (a.event.startTime || '00:00'));
                  const dateB = new Date(b.event.date + 'T' + (b.event.startTime || '00:00'));
                  return dateA.getTime() - dateB.getTime();
              })
        : [];

    return (
        <div className="h-full relative">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-on-surface">Events</h1>
                    <p className="text-on-surface-variant mt-2">Discover upcoming events!</p>
                </div>

                {/* search bar */}
                <div className="flex h-10 mb-6">
                    <TagFilterPopover tags={tags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 pl-10 pr-3 py-2 border border-r-0 text-on-surface border-outline-variant rounded-l-none leading-5 bg-surface placeholder-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:border-r-primary focus:z-10"
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-45 pl-3 pr-3 py-2 border border-r-0 text-on-surface border-outline-variant bg-surface placeholder-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:border-r-primary focus:z-10"
                    />
                    <div className="relative" ref={datePickerRef}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className={`pl-3 pr-3 py-2 border border-r-0 rounded-none bg-surface text-on-surface focus:outline-none h-10 whitespace-nowrap min-w-[120px] ${
                                showDatePicker
                                    ? 'border-primary ring-1 ring-primary z-10'
                                    : 'border-outline-variant focus:ring-1 focus:ring-primary focus:border-primary focus:border-r-primary focus:z-10'
                            }`}
                        >
                            {date ? date.toLocaleDateString() : 'Select Date'}
                        </button>
                        {showDatePicker && (
                            <div className="absolute z-50 mt-2 bg-surface border border-outline-variant rounded-md shadow-lg right-0">
                                <div className="p-2 border-b border-outline-variant">
                                    <button
                                        onClick={() => {
                                            setDate(null);
                                            setShowDatePicker(false);
                                        }}
                                        className="w-full text-sm py-1 px-2 text-on-surface-variant hover:bg-primary/10 rounded"
                                    >
                                        Clear Date
                                    </button>
                                </div>
                                <WebDatePicker
                                    selectedDate={date || new Date()}
                                    onDateSelected={selectedDate => {
                                        setDate(selectedDate);
                                        setShowDatePicker(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <TimeFilter afterTime={afterTime} beforeTime={beforeTime} setAfterTime={setAfterTime} setBeforeTime={setBeforeTime} />
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
                    {filteredEvents.map(({ event, club }) => (
                        <div key={event._id} className="bg-surface rounded-lg shadow p-6 border border-outline-variant">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-primary font-bold text-sm">
                                                {club?.name ? club.name.charAt(0).toUpperCase() : 'C'}
                                            </span>
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-medium text-on-surface">
                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className="text-secondary hover:text-primary hover:underline mr-1"
                                                >
                                                    {`${event.name}`}
                                                </Link>
                                                <span className="text-secondary mr-1"> - </span>
                                                <Link
                                                    to={`/club-profile/${club?.url}`}
                                                    className="text-secondary hover:text-primary hover:underline mr-1"
                                                >
                                                    {club?.name}
                                                </Link>
                                            </h2>
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
                                                    key={tag._id}
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
