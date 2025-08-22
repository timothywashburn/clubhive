import {
    EventData,
    CreateEventRequest,
    UpdateEventRequest,
    CreateEventResponse,
    UpdateEventResponse,
    DeleteEventResponse,
    ApiResponseBody,
    isSuccess,
    GetMyEventsResponse,
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

    async getMyEvents(): Promise<{ upcomingEvents: EventData[]; savedEvents: EventData[] }> {
        try {
            const response = await fetch(`${API_BASE_URL}/me/events`, {
                method: 'GET',
                ...this.getRequestOptions(),
            });

            const data: ApiResponseBody<GetMyEventsResponse> = await response.json();

            if (isSuccess(data)) {
                return {
                    upcomingEvents: data.upcomingEvents,
                    savedEvents: data.savedEvents,
                };
            } else {
                throw new Error(data.error?.message || 'Failed to fetch my events');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred while fetching my events');
        }
    }

    async toggleSaveEvent(eventId: string, save: boolean): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/save`, {
                method: 'POST',
                ...this.getRequestOptions(),
                body: JSON.stringify({ save }),
            });

            const data: ApiResponseBody<{ saved: boolean }> = await response.json();

            if (isSuccess(data)) {
                return data.saved;
            } else {
                throw new Error(data.error?.message || 'Failed to toggle save event');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred while toggling save event');
        }
    }
}

export const eventService = new EventService();
