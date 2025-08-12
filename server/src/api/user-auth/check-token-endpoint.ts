import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import AuthManager from '@/managers/auth-manager';

interface RefreshResponse {
    hasToken: boolean;
}

export const checkTokenhEndpoint: ApiEndpoint<undefined, RefreshResponse> = {
    path: '/api/user/check-token',
    method: 'get', // creating new access token
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const refreshToken = req.cookies?.refreshToken;

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

        try {
            AuthManager.verifyRefreshToken(refreshToken);
            res.json({
                success: true,
                hasToken: true,
            });
        } catch (error) {
            res.status(409).json({
                success: false,
                error: {
                    message: 'Invalid token',
                    code: ErrorCode.INVALID_TOKEN,
                },
            });
        }
    },
};
