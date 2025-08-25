import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';

type JoinClubButtonProps = {
    clubId: string;
    onJoinSuccess: () => void;
};

export default function JoinClubButton({ clubId, onJoinSuccess }: JoinClubButtonProps) {
    const [isJoining, setIsJoining] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const { successToast, errorToast } = useToast();

    useEffect(() => {
        // Fetch user's clubs to check membership
        fetch('/api/me/clubs')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const alreadyMember = data.clubs.some((club: any) => club._id === clubId);
                    setIsMember(alreadyMember);
                }
            })
            .catch(() => {
                errorToast('Failed to load clubs.');
            });
    }, [clubId]);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            const response = await fetch(`/api/memberships/${clubId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.success) {
                successToast('Successfully joined the club!');
                setIsMember(true);
                onJoinSuccess();
            } else {
                errorToast('Failed to join the club.');
            }
        } catch (error) {
            errorToast('Failed to join club.');
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <button
            onClick={handleJoin}
            disabled={isJoining || isMember}
            className="bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-primary/90 font-medium disabled:opacity-50"
        >
            {isMember ? 'Already a Member' : isJoining ? 'Joining...' : 'Join Club'}
        </button>
    );
}
