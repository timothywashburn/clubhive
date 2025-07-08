import { ApiEndpoint, AuthType, ErrorCode } from '@/types/api-types';

export interface TestRequest {
    message: string;
    timestamp?: string;
}

export interface TestResponse {
    receivedMessage: string;
    processedAt: string;
    echo: string;
}

export const testEndpoint: ApiEndpoint<TestRequest, TestResponse> = {
    path: '/api/test',
    method: 'post',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const { message, timestamp } = req.body;

        if (!message) {
            res.status(400).json({
                success: false,
                error: {
                    message: 'Message is required',
                    code: ErrorCode.MISSING_MESSAGE,
                },
            });
            return;
        }

        const response: TestResponse = {
            receivedMessage: message,
            processedAt: new Date().toISOString(),
            echo: `Server received: ${message}${timestamp ? ` at ${timestamp}` : ''}`,
        };

        res.json({
            success: true,
            data: response,
        });
    },
};
