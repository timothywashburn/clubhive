// testing controllers directly using jest
import { Request, Response } from 'express';
import { createEvent, saveEvent } from '../event-controller';
import mongoose from 'mongoose';

jest.mock('../models/Event');
jest.mock('../models/SavedEvent');
const mockObjectId = new mongoose.Types.ObjectId();
const mockObjectId2 = new mongoose.Types.ObjectId();
import Event from '../../models/event-schema';
import { EventType } from '../../models/event-schema';
import SavedEvent from '../../models/saved-events';

const mockEvent = Event as jest.Mocked<typeof Event>;
const mockSavedEvent = SavedEvent as jest.Mocked<typeof SavedEvent>;

describe('Create Event', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    beforeEach(() => {
        mockReq = {
            body: {
                club: mockObjectId,
                name: '858 Keeb Market',
                description: 'The biggest keyboard meet in the entire world :o',
                type: EventType.ANYONE,
                location: 'Price Center',
                date: new Date(),
                startTime: '12 pm',
                endTime: '6 pm',
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    // event success case
    it('should create an event & return 201', async () => {
        const newEvent = {
            school: mockObjectId,
            club: mockObjectId,
            name: '858 Keeb Market',
            description: 'The biggest keyboard meet in the entire world :o',
            type: EventType.ANYONE,
            location: 'Price Center',
            date: new Date(),
            startTime: '12 pm',
            endTime: '6 pm',
        };
        mockEvent.create.mockResolvedValue(newEvent as any);

        await createEvent(mockReq as Request, mockRes as Response);

        expect(mockEvent.create).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newEvent);
    });

    it('should cause an error and return 500', async () => {
        const error = new Error();

        mockEvent.create.mockRejectedValue(error);

        await createEvent(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error creating event' });
    });
});

describe('Save Event', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    beforeEach(() => {
        mockReq = {
            body: {
                userId: mockObjectId,
                eventId: mockObjectId2,
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    // save event success case
    it('should create a saved-event document & return 201', async () => {
        const newSavedEvent = {
            userId: mockObjectId,
            eventId: mockObjectId2,
        };
        mockSavedEvent.create.mockResolvedValue(newSavedEvent as any);

        await saveEvent(mockReq as Request, mockRes as Response);

        expect(mockEvent.create).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newSavedEvent);
    });

    // save event copy error case
    it('should throw an error & return 400', async () => {
        await saveEvent(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Event is already saved to user' });
    });

    it('should cause an error and return 500', async () => {
        const error = new Error();

        mockSavedEvent.create.mockRejectedValue(error);

        await saveEvent(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error saving event' });
    });
});
