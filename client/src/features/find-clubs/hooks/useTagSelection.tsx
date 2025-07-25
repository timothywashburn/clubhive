import { useState } from 'react';
import type { Tag } from '../../../hooks/fetchTags';

// this hook manages the tag selection state, allowing toggling tags on and off
// and provides a way to clear all selected tags
export function useTagSelection(initial: Tag[] = []) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>(initial);

    const toggleTagById = (tagId: string, allTags: Tag[]) => {
        setSelectedTags(prev => {
            const exists = prev.some(t => t._id === tagId);
            if (exists) {
                return prev.filter(t => t._id !== tagId);
            }
            const tag = allTags.find(t => t._id === tagId);
            return tag ? [...prev, tag] : prev;
        });
    };

    const clearTags = () => setSelectedTags([]);

    return { selectedTags, toggleTagById, setSelectedTags, clearTags };
}
