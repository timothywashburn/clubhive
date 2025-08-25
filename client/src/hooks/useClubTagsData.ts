import { useEffect, useState } from 'react';
import { TagData } from '@clubhive/shared';
import { useToast } from './useToast';

// this hook fetches club related tags
export const useClubTagsData = () => {
    const [tags, setTags] = useState<TagData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { errorToast } = useToast();

    useEffect(() => {
        fetch('/api/tags', {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const clubTags = data.tags.filter((tag: TagData) => tag.type === 'club');
                    setTags(clubTags);
                } else {
                    const errorMessage = data.error?.message || 'Unknown error';
                    setError(errorMessage);
                    errorToast(`Failed to load club tags: ${errorMessage}`);
                }
            })
            .catch(err => {
                setError(err.message);
                errorToast(`Failed to load club tags: ${err.message}`);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return { tags, isLoading, error };
};
