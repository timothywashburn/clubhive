import express, {
    Router,
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';
import {
    ApiEndpoint,
    ApiRequest,
    ApiResponse,
    AuthType,
} from '@/types/api-types';
import { statusEndpoint } from '@/api/misc/status';
import { testEndpoint } from '@/api/misc/test';
import { testGetClubsEndpoint } from '@/api/misc/test-club-endpoint';
import { ErrorCode } from '@clubhive/shared';

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
        this.addEndpoint(testGetClubsEndpoint);

        console.log(`registered api endpoints`);
    }

    private setupMiddleware() {
        this.router.use(express.json());

        this.router.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Methods',
                'GET, POST, PUT, DELETE'
            );
            res.header(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization'
            );
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

        this.router.use(
            (
                error: Error,
                req: Request,
                res: Response,
                _next: NextFunction
            ) => {
                console.error(error);
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Internal server error',
                        code: ErrorCode.INTERNAL_SERVER_ERROR,
                        details:
                            process.env.NODE_ENV === 'development'
                                ? error.message
                                : undefined,
                    },
                });
            }
        );
    }

    private handleAuth: RequestHandler = async (
        req: ApiRequest,
        res: ApiResponse,
        next: NextFunction
    ): Promise<void> => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'No token provided',
                    code: ErrorCode.MISSING_TOKEN,
                },
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        // TODO: Implement proper token verification
        if (!token) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid token',
                    code: ErrorCode.INVALID_TOKEN,
                },
            });
            return;
        }

        // TODO: Decode token and set req.auth
        req.auth = {
            authId: 'temp-auth-id',
            userId: 'temp-user-id',
        };

        next();
    };

    private addEndpoint<TReq, TRes>(endpoint: ApiEndpoint<TReq, TRes>) {
        const handlers: RequestHandler[] = [];
        if (
            endpoint.auth === AuthType.AUTHENTICATED ||
            endpoint.auth === AuthType.VERIFIED_EMAIL
        ) {
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
