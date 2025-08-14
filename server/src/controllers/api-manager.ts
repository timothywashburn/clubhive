import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiEndpoint, ApiRequest, ApiResponse, AuthType } from '@/types/api-types';
import AuthManager from '@/managers/auth-manager';
import { getClubProfileEndpoint } from '@/api/club-profile/club-profile-endpoint';
import { statusEndpoint } from '@/api/misc/status';
import { testEndpoint } from '@/api/misc/test';
import { getTagsEndpoint } from '@/api/misc/tags-endpoint';
import { changelogEndpoint } from '@/api/misc/changelog';
import { versionEndpoint } from '@/api/misc/version';

import { createEventEndpoint } from '@/api/events/create-event';
import { getEventByIdEndpoint } from '@/api/events/get-event-page';
import { getEventsEndpoint } from '@/api/events/get-events';
import { updateEventEndpoint } from '@/api/events/update-event';
import { deleteEventEndpoint } from '@/api/events/delete-event';
import { toggleSaveEventEndpoint } from '@/api/events/save-event';

import { ErrorCode } from '@clubhive/shared';
import { createClubEndpoint } from '@/api/clubs/create-club';
import { deleteClubEndpoint } from '@/api/clubs/delete-club';
import { getClubsEndpoint } from '@/api/clubs/get-clubs';
import { getClubEndpoint } from '@/api/clubs/get-club';
import { updateClubEndpoint } from '@/api/clubs/update-club';
import { getUsersEndpoint } from '@/api/users/get-users';
import { getUserEndpoint } from '@/api/users/get-user';
import { createAccountEndpoint } from '@/api/user-auth/create-account-endpoint';
import { signInEndpoint } from '@/api/user-auth/sign-in-endpoint';
import { signOutEndpoint } from '@/api/user-auth/sign-out-endpoint';
import { checkTokenhEndpoint } from '@/api/user-auth/check-token-endpoint';
import { tokenRefreshEndpoint } from '@/api/user-auth/token-refresh-endpoint';
import { getSchoolsEndpoint } from '@/api/schools/get-schools';
import { getSchoolEndpoint } from '@/api/schools/get-school';
import { createSchoolEndpoint } from '@/api/schools/create-school';
import { updateSchoolEndpoint } from '@/api/schools/update-school';
import { deleteSchoolEndpoint } from '@/api/schools/delete-school';
import { getMyClubsEndpoint } from '@/api/me/clubs';
import { getMyEventsEndpoint } from '@/api/me/events';
import { getClubMembersEndpoint } from '@/api/me/clubs';
import { getDailyVenueAvailabilityEndpoint } from '@/api/venues/daily-availability';
import { getWeeklyVenueAvailabilityEndpoint } from '@/api/venues/weekly-availability';
import { getMonthlyVenueAvailabilityEndpoint } from '@/api/venues/monthly-availability';
import { getNotificationsEndpoint } from '@/api/notifications/get-notifications';
import { markReadEndpoint } from '@/api/notifications/mark-read';
import { postNotificationEndpoint } from '@/api/notifications/post-notification';
import { deleteNotificationEndpoint } from '@/api/notifications/delete-notification';

import { uploadImageEndpoint } from '@/api/images/create-image';
import { deleteImageEndpoint } from '@/api/images/delete-image';
import { getImageEndpoint } from '@/api/images/get-image';
import { leaveMembershipEndpoint } from '@/api/memberships/leave-membership';

export default class ApiManager {
    private static instance: ApiManager;
    private readonly router: Router;

    private constructor() {
        this.router = express.Router();
        this.setupMiddleware();
        this.registerEndpoints();
    }

    private registerEndpoints() {
        this.addEndpoint(statusEndpoint);
        this.addEndpoint(testEndpoint);
        // this.addEndpoint(testGetClubsEndpoint);
        this.addEndpoint(getTagsEndpoint);
        this.addEndpoint(getClubProfileEndpoint);
        this.addEndpoint(changelogEndpoint);
        this.addEndpoint(versionEndpoint);

        // Club endpoints
        this.addEndpoint(createClubEndpoint);
        this.addEndpoint(getClubsEndpoint);
        this.addEndpoint(getClubEndpoint);
        this.addEndpoint(updateClubEndpoint);
        this.addEndpoint(deleteClubEndpoint);

        // User endpoints
        this.addEndpoint(getUsersEndpoint);
        this.addEndpoint(getUserEndpoint);
        this.addEndpoint(createAccountEndpoint);
        this.addEndpoint(signInEndpoint);
        this.addEndpoint(signOutEndpoint);
        this.addEndpoint(tokenRefreshEndpoint);
        this.addEndpoint(checkTokenhEndpoint);

        // School endpoints
        this.addEndpoint(createSchoolEndpoint);
        this.addEndpoint(getSchoolsEndpoint);
        this.addEndpoint(getSchoolEndpoint);
        this.addEndpoint(updateSchoolEndpoint);
        this.addEndpoint(deleteSchoolEndpoint);

        // Event endpoints
        this.addEndpoint(createEventEndpoint);
        this.addEndpoint(getEventByIdEndpoint);
        this.addEndpoint(getEventsEndpoint);
        this.addEndpoint(updateEventEndpoint);
        this.addEndpoint(deleteEventEndpoint);
        this.addEndpoint(toggleSaveEventEndpoint);

        // Notifications endpoints
        this.addEndpoint(getNotificationsEndpoint);
        this.addEndpoint(markReadEndpoint);
        this.addEndpoint(postNotificationEndpoint);
        this.addEndpoint(deleteNotificationEndpoint);

        // Me endpoints
        this.addEndpoint(getMyClubsEndpoint);
        this.addEndpoint(getMyEventsEndpoint);

        // Venue endpoints
        this.addEndpoint(getDailyVenueAvailabilityEndpoint);
        this.addEndpoint(getWeeklyVenueAvailabilityEndpoint);
        this.addEndpoint(getMonthlyVenueAvailabilityEndpoint);

        // Images endpoints
        this.addEndpoint(getImageEndpoint);
        this.addEndpoint(uploadImageEndpoint);
        this.addEndpoint(deleteImageEndpoint);

        // Membership endpoints
        this.addEndpoint(leaveMembershipEndpoint);

        console.log(`registered api endpoints`);
    }

    private setupMiddleware() {
        this.router.use(express.json());

        this.router.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });

        this.router.use((req: Request, res: Response, next: NextFunction) => {
            if (!req.path.startsWith('/api')) {
                next();
                return;
            }

            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${req.method} ${req.path}`);
            next();
        });

        this.router.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
            console.error(error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Internal server error',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                },
            });
        });
    }

    private parseAuth: RequestHandler = async (req: ApiRequest, res: ApiResponse, next: NextFunction): Promise<void> => {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            try {
                const tokenPayload = AuthManager.verifyRefreshToken(refreshToken);
                req.auth = AuthManager.toAuthInfo(tokenPayload);
            } catch (error) {
                // Silently ignore invalid tokens - req.auth will remain undefined
            }
        }

        next();
    };

    private handleAuth: RequestHandler = async (req: ApiRequest, res: ApiResponse, next: NextFunction): Promise<void> => {
        if (!req.auth) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'No valid token provided',
                    code: ErrorCode.MISSING_TOKEN,
                },
            });
            return;
        }

        next();
    };

    private addEndpoint<TReq, TRes>(endpoint: ApiEndpoint<TReq, TRes>) {
        const handlers: RequestHandler[] = [];

        // Always parse auth if cookies exist
        handlers.push(this.parseAuth);

        // Only enforce auth requirements for authenticated endpoints
        if (endpoint.auth === AuthType.AUTHENTICATED || endpoint.auth === AuthType.VERIFIED_EMAIL) {
            handlers.push(this.handleAuth);
        }

        handlers.push(endpoint.handler);

        this.router[endpoint.method](endpoint.path, ...handlers);
    }

    getRouter(): Router {
        return this.router;
    }

    static getInstance(): ApiManager {
        if (!ApiManager.instance) ApiManager.instance = new ApiManager();
        return ApiManager.instance;
    }
}
