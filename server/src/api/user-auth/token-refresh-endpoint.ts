import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import jwt from 'jsonwebtoken';

interface RefreshResponse {
    accessToken: string;
}

export const tokenRefresh: ApiEndpoint<undefined, RefreshResponse> = {
    path: '/api/user/refreshToken',
    method: 'post', // creating new access token
    auth: AuthType.AUTHENTICATED,
    handler: async (req, res) => {
        const refreshToken = req.cookies.refreshToken; // gets refreshToken from client side storage

        const REFRESH_TOKEN_SECRET = 'temp refresh'; // real token should go in .env
        const ACCESS_TOKEN_SECRET = 'temp access';

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
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error: any, authId: any) => {
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
            const accessToken = jwt.sign(authId, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({
                success: true,
                accessToken: accessToken,
            });
        });
    },
};
