import { ErrorCode } from '@clubhive/shared';
import mongoose from 'mongoose';
import { ApiEndpoint, AuthType, ApiRequest, ApiResponse } from '@/types/api-types';

interface ClubMembershipReq {
    userId: string;
    clubId: string;
}

interface ClubMembershipRes {
    membershipId: string;
}

const clubMembershipSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    clubId: { type: String, required: true },
    role: { type: String, default: 'member' },
    createdAt: { type: Date, default: Date.now },
});

const ClubMembership = mongoose.models.ClubMembership || mongoose.model('ClubMembership', clubMembershipSchema);

export const ClubMembershipEndpoint: ApiEndpoint<ClubMembershipReq, ClubMembershipRes> = {
    path: '/api/memberships',
    method: 'post',
    auth: AuthType.AUTHENTICATED,
    handler: async (req: ApiRequest<ClubMembershipReq>, res: ApiResponse<ClubMembershipRes>) => {
        try {
            const { userId, clubId } = req.body;

            if (!userId || !clubId) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Missing userId and/or clubId',
                        code: ErrorCode.MISSING_MESSAGE,
                    },
                });
                return;
            }

            const existing = await ClubMembership.findOne({ userId, clubId });
            if (existing) {
                res.status(409).json({
                    success: false,
                    error: {
                        message: 'User already registered for this club',
                        code: ErrorCode.INVALID_INPUT,
                    },
                });
                return;
            }

            const newMembership = await ClubMembership.create({
                userId,
                clubId,
            });

            res.json({
                success: true,
                membershipId: newMembership._id.toString(),
            });
        } catch (error) {
            console.error('Error creating club membership:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Internal server error',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                },
            });
        }
    },
};
