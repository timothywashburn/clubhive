import { Request, Response } from 'express';

export enum AuthType {
    NONE = 'none',
    AUTHENTICATED = 'authenticated',
    VERIFIED_EMAIL = 'verified_email',
}

export enum ErrorCode {
    // General errors
    INTERNAL_SERVER_ERROR = 'internal_server_error',

    // Authentication errors
    MISSING_TOKEN = 'missing_token',
    INVALID_TOKEN = 'invalid_token',
    UNAUTHORIZED = 'unauthorized',

    // Validation errors
    MISSING_MESSAGE = 'missing_message',
    INVALID_INPUT = 'invalid_input',
    VALIDATION_FAILED = 'validation_failed',

    // Resource errors
    NOT_FOUND = 'not_found',
}

export interface AuthInfo {
    authId: string;
    userId: string;
}

export interface ApiRequest<TReq = unknown> extends Request {
    body: TReq;
    auth?: AuthInfo;
}

export interface ApiSuccessResponse<TRes = unknown> {
    success: true;
    data: TRes;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code?: ErrorCode;
        details?: unknown;
    };
}

export type ApiResponseBody<TRes = unknown> =
    | ApiSuccessResponse<TRes>
    | ApiErrorResponse;

export interface ApiResponse<TRes = unknown> extends Response {
    json: (body: ApiResponseBody<TRes>) => this;
}

export interface ApiEndpoint<TReq = unknown, TRes = unknown> {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    auth: AuthType;
    handler: (req: ApiRequest<TReq>, res: ApiResponse<TRes>) => Promise<void>;
}
