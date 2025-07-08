import { Request, Response } from 'express';
import { AuthInfo, ApiResponseBody } from '@clubhive/shared';

export enum AuthType {
    NONE = 'none',
    AUTHENTICATED = 'authenticated',
    VERIFIED_EMAIL = 'verified_email',
}

export interface ApiRequest<TReq = unknown> extends Request {
    body: TReq;
    auth?: AuthInfo;
}

export interface ApiResponse<TRes = unknown> extends Response {
    json: (body: ApiResponseBody<TRes>) => this;
}

export interface ApiEndpoint<TReq = unknown, TRes = unknown> {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    auth: AuthType;
    handler: (req: ApiRequest<TReq>, res: ApiResponse<TRes>) => Promise<void>;
}
