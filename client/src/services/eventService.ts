import {
    EventData,
    CreateEventRequest,
    UpdateEventRequest,
    CreateEventResponse,
    UpdateEventResponse,
    DeleteEventResponse,
    ApiResponseBody,
    isSuccess,
} from '@clubhive/shared';

const API_BASE_URL = '/api';

interface ApiError {
    message: string;
    code?: string;
}

class EventService {
    private getRequestOptions(): RequestInit {
        return {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    async createEvent(eventData: CreateEventRequest): Promise<EventData> {
        try {
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                ...this.getRequestOptions(),
                body: JSON.stringify(eventData),
            });

            const data: ApiResponseBody<CreateEventResponse> = await response.json();

            if (isSuccess(data)) {
                return data.event;
            } else {
                throw new Error(data.error?.message || 'Failed to create event');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred while creating event');
        }
    }

    async updateEvent(eventId: string, eventData: UpdateEventRequest): Promise<EventData> {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
                method: 'PUT',
                ...this.getRequestOptions(),
                body: JSON.stringify(eventData),
            });

            const data: ApiResponseBody<UpdateEventResponse> = await response.json();

            if (isSuccess(data)) {
                return data.event;
            } else {
                throw new Error(data.error?.message || 'Failed to update event');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred while updating event');
        }
    }

    async deleteEvent(eventId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
                method: 'DELETE',
                ...this.getRequestOptions(),
            });

            const data: ApiResponseBody<DeleteEventResponse> = await response.json();

            if (!isSuccess(data)) {
                throw new Error(data.error?.message || 'Failed to delete event');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred while deleting event');
        }
    }

    // Helper method to convert EventData to CreateEventRequest
    convertToCreateRequest(eventData: EventData): CreateEventRequest {
        return {
            club: eventData.club,
            name: eventData.name,
            description: eventData.description,
            type: eventData.type,
            location: eventData.location,
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            tags: (eventData.tags || []).map(tag => (typeof tag === 'string' ? tag : tag._id)),
        };
    }

    // Helper method to convert EventData to UpdateEventRequest
    convertToUpdateRequest(eventData: EventData): UpdateEventRequest {
        return {
            name: eventData.name,
            description: eventData.description,
            type: eventData.type,
            location: eventData.location,
            date: eventData.date,
            startTime: eventData.startTime,
            endTime: eventData.endTime,
            published: eventData.published,
            tags: (eventData.tags || []).map(tag => (typeof tag === 'string' ? tag : tag._id)),
        };
    }
}

export const eventService = new EventService();
