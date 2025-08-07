import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';

export const logoutEndpoint: ApiEndpoint<undefined, undefined> = {
    path: '/api/user/logout',
    method: 'delete',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
            });
            res.json({ success: true });
        } catch (error) {
            console.error('Error logging out:', error);
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
