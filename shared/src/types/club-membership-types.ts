import { z } from 'zod';

export enum ClubRole {
    OWNER = 'owner',
    MEMBER = 'member',
    OFFICER = 'officer',
    PRINCIPAL_MEMBER = 'principal_member',
}

export const clubMembershipSchema = z.object({
    _id: z.string(),
    user: z.string(),
    club: z.string(),
    role: z.enum([ClubRole.OWNER, ClubRole.MEMBER, ClubRole.OFFICER, ClubRole.PRINCIPAL_MEMBER]),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const createMembershipRequestSchema = z.object({
    clubId: z.string(),
    userId: z.string(),
    role: z.enum([ClubRole.OWNER, ClubRole.MEMBER, ClubRole.OFFICER, ClubRole.PRINCIPAL_MEMBER]),
});

export type CreateMembershipRequest = z.infer<typeof createMembershipRequestSchema>;
export type ClubMembershipData = z.infer<typeof clubMembershipSchema>;

export interface LeaveMembershipResponse {
    message?: string;
}

export interface GetClubOfficersResponse {
    success: boolean;
    officers: {
        role: ClubRole;
        name: string;
    }[];
    error?: { message: string };
}
