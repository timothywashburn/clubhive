import { ApiEndpoint, AuthType } from '@/types/api-types';

export interface StatusResponse {
    status: string;
    timestamp: string;
    environment: string;
}

export const statusEndpoint: ApiEndpoint<undefined, StatusResponse> = {
    path: '/api/status',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const response: StatusResponse = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
        };

        res.json({
            success: true,
            ...response,
        });
    },
};
