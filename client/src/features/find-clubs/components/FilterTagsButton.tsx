import { useState, useRef, useEffect } from 'react';
import type { Tag } from '../../../hooks/fetchTags';
import { TagSelectionPopup } from './TagsSelectionPopup';

type Props = {
    tags: Tag[];
    selectedTags: Tag[];
    setSelectedTags: (tags: Tag[]) => void;
};

// this is the button that opens up the tag selection popup (TagSelectionPopup)
export default function FilterTagsButton({ tags, selectedTags, setSelectedTags }: Props) {
    const [open, setOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement | null>(null);

    function toggleTagById(tagId: string) {
        const tag = tags.find(t => t._id === tagId);
        if (!tag) return;
        const exists = selectedTags.some(t => t._id === tagId);
        if (exists) {
            setSelectedTags(selectedTags.filter(t => t._id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

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

    return (
        <div className="text-left" ref={popoverRef}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="h-10 px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant rounded-md rounded-r-none flex items-center focus:border-primary"
            >
                Filter
            </button>

            {open && <TagSelectionPopup tags={tags} selectedTags={selectedTags} toggleTag={toggleTagById} />}
        </div>
    );
}
