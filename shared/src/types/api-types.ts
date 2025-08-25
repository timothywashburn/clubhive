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

    // EMS API errors
    MISSING_DATE = 'missing_date',
    INVALID_DATE = 'invalid_date',
    EMS_CONFIG_ERROR = 'ems_config_error',
    EMS_API_ERROR = 'ems_api_error',
    FETCH_AVAILABILITY_ERROR = 'fetch_availability_error',
    FETCH_WEEKLY_AVAILABILITY_ERROR = 'fetch_weekly_availability_error',
    FETCH_MONTHLY_AVAILABILITY_ERROR = 'fetch_monthly_availability_error',
}

export interface AuthInfo {
    authId: string;
    userId: string;
}

export type ApiSuccessResponse<TRes = unknown> = TRes extends undefined ? { success: true } : TRes & { success: true };

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
