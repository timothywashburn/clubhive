import { useEffect, useState } from 'react';
import type { Tag } from './fetchTags';

export type Club = {
    _id: string;
    name: string;
    tagline: string;
    description: string;
    url: string;
    members: string[];
    tags: Tag[];
    createdAt: Date;
    updatedAt: Date;
    socials: {
        website?: string;
        discord?: string;
        instagram?: string;
    };
    clubLogo?: string; // URL or ObjectId reference to the club logo image
    pictures?: string[]; // Array of URLs or ObjectId references to club pictures
};

export const useClubData = () => {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/clubs')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setClubs(data.data.clubs);
                } else {
                    setError(data.error?.message || 'Unknown error');
                }
            })
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    return { clubs, isLoading, error };
};
