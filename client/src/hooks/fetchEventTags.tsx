import { useEffect, useState } from 'react';
import { TagData } from '@clubhive/shared';
import { useToast } from './useToast';

// this hook fetchs event-related tags
export const useEventTagsData = () => {
    const [tags, setTags] = useState<TagData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    useEffect(() => {
        fetch('/api/tags')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const eventTags = data.tags.filter((tag: TagData) => tag.type === 'event');
                    setTags(eventTags);
                } else {
                    const errorMessage = data.error?.message || 'Unknown error';
                    setError(errorMessage);
                    errorToast(`Failed to load event tags: ${errorMessage}`);
                }
            })
            .catch(err => {
                setError(err.message);
                errorToast(`Failed to load event tags: ${err.message}`);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return { tags, isLoading, error };
};
