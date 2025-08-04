import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode } from '@clubhive/shared';
import SavedEvents from '@/models/saved-events';
import Event from '@/models/event-schema';

export interface GetSavedEventsResponse {
    events: Event[];
}

export const getSavedEventsEndpoint: ApiEndpoint<undefined, GetSavedEventsResponse> = {
    path: '/api/saved-events',
    method: 'get',
    auth: AuthType.AUTHENTICATED,
    handler: async (req, res) => {},
};
