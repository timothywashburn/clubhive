import { useEffect, useState } from 'react';
import { TagData } from '@clubhive/shared';

// this hook fetchs event-related tags
export const useEventTagsData = () => {
    const [tags, setTags] = useState<TagData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/tags')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const eventTags = data.tags.filter((tag: TagData) => tag.type === 'event');
                    setTags(eventTags);
                } else {
                    setError(data.error?.message || 'Unknown error');
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return { tags, isLoading, error };
};
