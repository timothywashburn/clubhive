import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode, GetWeeklyVenueAvailabilityResponse, GetDailyVenueAvailabilityResponse } from '@clubhive/shared';
import { ClubhiveConfigModel } from '@/models/clubhive-config-schema';

interface ApiResponse {
    success: boolean;
    data?: GetWeeklyVenueAvailabilityResponse;
    error?: {
        message: string;
        code: string;
    };
}

export const getWeeklyVenueAvailabilityEndpoint: ApiEndpoint<undefined, GetWeeklyVenueAvailabilityResponse> = {
    method: 'get',
    path: '/api/venues/availability/weekly',
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
            const startDate = new Date(date as string);
            if (isNaN(startDate.getTime())) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid date format. Use YYYY-MM-DD',
                        code: ErrorCode.INVALID_DATE,
                    },
                });
                return;
            }

            // Get config from database
            const config = await ClubhiveConfigModel.findOne();
            if (!config || !config.emsApiBaseUrl || !config.emsApiToken) {
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'EMS API configuration missing',
                        code: ErrorCode.EMS_CONFIG_ERROR,
                    },
                });
                return;
            }

            // Call EMS API weekly endpoint
            const response = await fetch(`${config.emsApiBaseUrl}/api/availability/weekly?date=${date}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${config.emsApiToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`EMS API responded with status: ${response.status}`);
            }

            const emsData: ApiResponse = await response.json();

            if (!emsData.success || !emsData.data) {
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Failed to fetch weekly venue availability from EMS',
                        code: ErrorCode.EMS_API_ERROR,
                    },
                });
                return;
            }

            res.json({
                success: true,
                week_start: emsData.data.week_start,
                days: emsData.data.days,
            });
        } catch (error) {
            console.error('Error fetching weekly venue availability:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch weekly venue availability',
                    code: ErrorCode.FETCH_WEEKLY_AVAILABILITY_ERROR,
                },
            });
        }
    },
};
