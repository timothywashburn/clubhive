import { useState, useRef, useEffect } from 'react';
import type { Tag } from '../../hooks/fetchTags';

type Props = {
    tags: Tag[];
    selectedTags: Tag[];
    setSelectedTags: (tags: Tag[]) => void;
};

export default function TagFilterPopover({ tags, selectedTags, setSelectedTags }: Props) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    // Close the popover when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTag = (tagId: string) => {
        if (selectedTags.find(tag => tag._id === tagId)) {
            setSelectedTags(selectedTags.filter(tag => tag._id !== tagId));
        } else {
            const newTag = tags.find(tag => tag._id === tagId);
            if (newTag) {
                setSelectedTags([...selectedTags, newTag]);
            }
        }
    };

    return (
        <div className="text-left" ref={popoverRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="h-10 px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant rounded-md rounded-r-none flex items-center"
            >
                Filter
            </button>

            {open && (
                <div className="absolute mt-2 z-20 w-64 bg-surface border border-outline-variant rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-sm text-on-surface-variant mb-2">Select tags:</p>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                        {tags.map(tag => {
                            const isSelected = selectedTags.find(selectedTag => selectedTag._id === tag._id);
                            return (
                                <button
                                    key={tag._id}
                                    onClick={() => toggleTag(tag._id)}
                                    className={`px-3 py-1 rounded-full text-sm border transition ${
                                        isSelected
                                            ? 'bg-primary-container text-primary font-semibold border-primary'
                                            : 'bg-surface text-on-surface-variant border-outline-variant hover:bg-outline-variant'
                                    }`}
                                >
                                    {tag.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
