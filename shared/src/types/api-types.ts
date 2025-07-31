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

export type ApiSuccessResponse<TRes = unknown> = TRes & {
    success: true;
};

// export interface ApiSuccessResponse<TRes = unknown> {
//     success: true;
//     data: TRes;
// }

export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code?: ErrorCode;
        details?: unknown;
    };
}

export type ApiResponseBody<TRes = unknown> = ApiSuccessResponse<TRes> | ApiErrorResponse;

export const isSuccess = <T>(data: ApiResponseBody<T>): data is ApiSuccessResponse<T> => {
    return data.success;
};
