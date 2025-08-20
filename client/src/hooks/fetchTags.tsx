import { useEffect, useState } from 'react';
import { TagData } from '@clubhive/shared';

export const useTagsData = () => {
    const [tags, setTags] = useState<TagData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/tags')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const clubTags = data.tags.filter((tag: TagData) => tag.type === 'club');
                    setTags(clubTags);
                } else {
                    setError(data.error?.message || 'Unknown error');
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return { tags, isLoading, error };
};
