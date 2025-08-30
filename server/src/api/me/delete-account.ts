import { AuthType, ApiEndpoint } from '@/types/api-types';
import { DeleteUserResponse } from '@clubhive/shared';

import User from '@/models/user-schema';
import ClubMembership from '@/models/club-membership-schema';
import UserNotification from '@/models/user-notification-schema';
import SavedEvents from '@/models/saved-events';
import Auth from '@/models/auth-schema';

export const deleteAccountEndpoint: ApiEndpoint<undefined, DeleteUserResponse> = {
    path: '/api/me/delete-account',
    method: 'delete',
    auth: AuthType.VERIFIED_EMAIL,
    handler: async (req, res) => {
        try {
            const userId = req.auth?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    error: {
                        message: 'User not authenticated',
                    },
                });
                return;
            }

            await Promise.all([
                ClubMembership.deleteMany({ user: userId }),
                UserNotification.deleteMany({ user: userId }),
                SavedEvents.deleteMany({ user: userId }),
                Auth.deleteMany({ user: userId }),
            ]);

            const deleted = await User.findByIdAndDelete(userId);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found',
                    },
                });
                return;
            }
            res.json({
                success: true,
                deleted: true,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error deleting user',
                },
            });
        }
    },
};
