import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode, GetDailyVenueAvailabilityResponse } from '@clubhive/shared';
import { ConfigManager } from '@/services/config-manager';

interface ApiResponse {
    success: boolean;
    data?: GetDailyVenueAvailabilityResponse;
    error?: {
        message: string;
        code: string;
    };
}

export const getDailyVenueAvailabilityEndpoint: ApiEndpoint<undefined, GetDailyVenueAvailabilityResponse> = {
    method: 'get',
    path: '/api/venues/availability/daily',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const { date } = req.query;

            if (!date) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'date parameter is required (format: YYYY-MM-DD)',
                        code: ErrorCode.MISSING_DATE,
                    },
                });
                return;
            }

            // Validate date format
            const targetDate = new Date(date as string);
            if (isNaN(targetDate.getTime())) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid date format. Use YYYY-MM-DD',
                        code: ErrorCode.INVALID_DATE,
                    },
                });
                return;
            }

            const config = await ConfigManager.getConfig();
            const response = await fetch(`${config.emsApi.host}/api/availability/daily?date=${date}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.emsApi.token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error(`EMS API responded with status: ${response.status}`);

            const emsData: ApiResponse = await response.json();

            if (!emsData.success || !emsData.data) {
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Failed to fetch venue availability from EMS',
                        code: ErrorCode.EMS_API_ERROR,
                    },
                });
                return;
            }

            res.json({
                success: true,
                date: emsData.data.date,
                rooms: emsData.data.rooms,
            });
        } catch (error) {
            console.error('Error fetching daily venue availability:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch venue availability',
                    code: ErrorCode.FETCH_AVAILABILITY_ERROR,
                },
            });
        }
    },
};
