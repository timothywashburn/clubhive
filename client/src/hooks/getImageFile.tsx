import { useEffect, useState } from 'react';
import type { ImageData } from '@clubhive/shared';

export function useImageData(imageId: string | null) {
    const [image, setImage] = useState<ImageData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!imageId) {
            setImage(null);
            return;
        }
        setLoading(true);
        fetch(`/api/images/${imageId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setImage(data.image);
                    setError(null);
                } else {
                    setImage(null);
                    setError(data.error?.message || 'Failed to fetch image');
                }
            })
            .catch(err => {
                setImage(null);
                setError(err.message || 'Failed to fetch image');
            })
            .finally(() => setLoading(false));
    }, [imageId]);

    return { image, loading, error };
}
