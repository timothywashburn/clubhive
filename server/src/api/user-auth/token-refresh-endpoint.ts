import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import AuthManager from '@/managers/auth-manager';

interface RefreshResponse {
    accessToken: string;
}

export const tokenRefreshEndpoint: ApiEndpoint<undefined, RefreshResponse> = {
    path: '/api/user/refreshToken',
    method: 'post', // creating new access token
    auth: AuthType.AUTHENTICATED,
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
            const accessToken = AuthManager.refreshAccessToken(refreshToken);
            res.json({
                success: true,
                accessToken: accessToken,
            });
        } catch (error) {
            res.status(409).json({
                success: false,
                error: {
                    message: 'Invalid refresh token',
                    code: ErrorCode.INVALID_TOKEN,
                },
            });
        }
    },
};
