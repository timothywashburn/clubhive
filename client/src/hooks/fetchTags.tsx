import { useEffect, useState } from 'react';

export type Tag = {
    _id: string;
    text: string;
    type: string;
};

export const useTagsData = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/tags')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setTags(data.tags);
                } else {
                    setError(data.error?.message || 'Unknown error');
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return { tags, isLoading, error };
};
