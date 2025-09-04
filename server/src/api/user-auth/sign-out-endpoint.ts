import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode } from '@clubhive/shared';
import AuthManager from '@/managers/auth-manager';

export const signOutEndpoint: ApiEndpoint<undefined, undefined> = {
    method: 'post',
    path: '/api/user/sign-out',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            AuthManager.clearRefreshTokenCookie(res);

            res.status(200).json({
                success: true,
            });
        } catch (error) {
            console.error('Error during sign out:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Sign out failed',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                },
            });
        }
    },
};
