import { useState, useEffect } from 'react';
import { X, Upload, Tag } from 'lucide-react';
import { Event } from '../../types';

interface EventModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Event) => void;
    selectedDate?: Date;
}

const OPEN_TO_OPTIONS = [
    { value: 'club-executives', label: 'Club Executives' },
    { value: 'club-officers', label: 'Club Officers' },
    { value: 'students', label: 'Students' },
    { value: 'everyone', label: 'Everyone' },
] as const;

const COMMON_TAGS = [
    'Free Food',
    'Fundraiser',
    'Social',
    'Educational',
    'Workshop',
    'Meeting',
    'Competition',
    'Volunteer',
    'Networking',
];

export function EventModal({ event, isOpen, onClose, onSave, selectedDate }: EventModalProps) {
    const [formData, setFormData] = useState<Event>({
        id: '',
        title: '',
        date: '',
        time: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        attendees: 0,
        openTo: 'students',
        pictures: [],
        tags: [],
        published: false,
    });


    useEffect(() => {
        if (event) {
            setFormData(event);
        } else if (selectedDate) {
            // Pre-fill date for new events
            setFormData(prev => ({
                ...prev,
                date: selectedDate.toISOString().split('T')[0],
                id: Date.now().toString(), // Generate a temporary ID for new events
            }));
        }
    }, [event, selectedDate]);

    const handleInputChange = (field: keyof Event, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddTag = (tag: string) => {
        if (tag && !formData.tags?.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag],
            }));
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: (prev.tags || []).filter(tag => tag !== tagToRemove),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-lg shadow-xl w-full max-w-[1400px] max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Sticky */}
                <div className="sticky top-0 z-10 bg-surface flex items-center justify-between p-6 border-b border-outline-variant">
                    <h2 className="text-xl font-semibold text-on-surface">
                        {event ? 'Edit Event' : 'Create Event'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-variant rounded-md transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5 text-on-surface" />
                    </button>
                </div>

                {/* Content - Two Column Layout */}
                <div className="flex flex-1 min-h-0">
                    {/* Form Section */}
                    <div className="flex-1 min-w-0 flex flex-col" style={{ maxWidth: '60%' }}>
                        <form id="event-form" onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Published Status - Prominent Position */}
                        <div className="bg-surface-variant/50 p-4 rounded-lg border-l-4 border-primary">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-on-surface">Event Status</h4>
                                    <p className="text-xs text-on-surface-variant mt-1">
                                        {formData.published ? 'This event is published and visible to members' : 'This event is a draft and not visible to members'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.published}
                                        onChange={e => handleInputChange('published', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    <span className="ml-3 text-sm font-medium text-on-surface">
                                        {formData.published ? 'Published' : 'Draft'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">
                                Event Name
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
                            />
                        </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={e => handleInputChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            Open To
                        </label>
                        <select
                            value={formData.openTo}
                            onChange={e => handleInputChange('openTo', e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                        >
                            {OPEN_TO_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={e => handleInputChange('location', e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => handleInputChange('date', e.target.value)}
                            className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={e => handleInputChange('startTime', e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-2">
                                End Time
                            </label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={e => handleInputChange('endTime', e.target.value)}
                                className="w-full px-3 py-2 border border-outline-variant rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-on-surface"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            Pictures
                        </label>
                        <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-on-surface-variant mx-auto mb-2" />
                            <p className="text-sm text-on-surface-variant mb-2">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-on-surface-variant">
                                PNG, JPG up to 10MB
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                    // Handle file upload logic here
                                    console.log('Files selected:', e.target.files);
                                }}
                            />
                        </div>
                        {formData.pictures && formData.pictures.length > 0 && (
                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {formData.pictures.map((picture, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={picture}
                                            alt={`Event ${index + 1}`}
                                            className="w-full h-20 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newPictures = (formData.pictures || []).filter((_, i) => i !== index);
                                                handleInputChange('pictures', newPictures);
                                            }}
                                            className="absolute -top-1 -right-1 bg-error text-on-error rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {COMMON_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => handleAddTag(tag)}
                                    disabled={formData.tags?.includes(tag)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                        formData.tags?.includes(tag)
                                            ? 'bg-primary/20 text-primary cursor-not-allowed'
                                            : 'bg-surface-variant text-on-surface-variant hover:bg-primary/10 hover:text-primary cursor-pointer'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {formData.tags && formData.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {formData.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-error transition-colors cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                            </div>
                        </form>
                    </div>

                    {/* Resources Section - Placeholder for future content */}
                    <div className="flex-1 border-l border-outline-variant bg-surface-variant/30 flex flex-col">
                        <div className="flex-1 p-6">
                            <h3 className="text-lg font-medium text-on-surface mb-4">
                                Event Resources
                            </h3>
                            <div className="text-sm text-on-surface-variant">
                                <p>Resources to help you plan your event will appear here.</p>
                                <p className="mt-2">This section will contain:</p>
                                <ul className="mt-2 space-y-1 list-disc list-inside">
                                    <li>Suggested venues and locations</li>
                                    <li>Budget planning tools</li>
                                    <li>Event checklist templates</li>
                                    <li>Marketing and promotion tips</li>
                                    <li>Vendor recommendations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer Buttons - Full Width */}
                <div className="sticky bottom-0 bg-surface border-t border-outline-variant p-6">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-on-surface border border-outline-variant rounded-md hover:bg-surface-variant transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="event-form"
                            className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                            {event ? 'Save Changes' : 'Create Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}