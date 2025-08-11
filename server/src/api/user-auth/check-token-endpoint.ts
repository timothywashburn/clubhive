import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import jwt from 'jsonwebtoken';

interface RefreshResponse {
    hasToken: boolean;
}

export const checkTokenhEndpoint: ApiEndpoint<undefined, RefreshResponse> = {
    path: '/api/user/check-token',
    method: 'get', // creating new access token
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const refreshToken = req.cookies.refreshToken; // gets refreshToken from client side storage

        if (!refreshToken) {
            res.status(409).json({
                success: false,
                error: {
                    message: 'Error fetching token',
                    code: ErrorCode.INVALID_INPUT,
                },
            });
            return;
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (error: any, authId: any) => {
            if (error) {
                res.status(409).json({
                    success: false,
                    error: {
                        message: 'Error',
                        code: ErrorCode.INVALID_INPUT,
                    },
                });
                return;
            }
            res.json({
                success: true,
                hasToken: true,
            });
        });
    },
};
