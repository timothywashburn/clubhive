import React, { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/useToast';
import { useNavigate } from 'react-router';

type JoinClubButtonProps = {
    clubId: string;
    onJoinSuccess: () => void;
};

export default function JoinClubButton({ clubId, onJoinSuccess }: JoinClubButtonProps) {
    const [isJoining, setIsJoining] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { successToast, errorToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/me/clubs')
            .then(res => {
                if (res.status === 401) {
                    setIsAuthenticated(false);
                    return null;
                }
                setIsAuthenticated(true);
                return res.json();
            })
            .then(data => {
                if (data && data.success) {
                    const alreadyMember = data.clubs.some((club: any) => club._id === clubId);
                    setIsMember(alreadyMember);
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
                errorToast('Failed to load clubs.');
            });
    }, [clubId]);

    const handleJoin = async () => {
        if (isAuthenticated === false) {
            navigate('/signin');
            return;
        }
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
            className="bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary/90 hover:cursor-pointer font-medium disabled:opacity-50 disabled:hover:cursor-not-allowed transition-colors"
        >
            {isMember ? 'Already a Member' : isJoining ? 'Joining...' : isAuthenticated === false ? 'Sign In to Join' : 'Join Club'}
        </button>
    );
}
