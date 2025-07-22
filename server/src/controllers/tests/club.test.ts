// testing controllers directly using jest
import { Request, Response } from 'express';
import { createClub, joinClub } from '../club-controller';
import mongoose from 'mongoose';

jest.mock('../models/Club');
jest.mock('../models/ClubMembership');
const mockObjectId = new mongoose.Types.ObjectId();
const mockObjectId2 = new mongoose.Types.ObjectId();
import Club from '../../models/club-schema';
import ClubMembership from '@/models/club-membership-schema';

const mockClub = Club as jest.Mocked<typeof Club>;
const mockClubMembership = ClubMembership as jest.Mocked<typeof ClubMembership>;

/* testing createClub */

describe('Create Club', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    beforeEach(() => {
        mockReq = {
            body: {
                school: mockObjectId,
                name: 'Keyboard Club',
                tagline: 'Community for anyone interested in mechanical keyboards',
                description: 'Look out for our upcoming big event in fall quarter! :D',
                website: 'ucsdkeebs.com',
                discord: 'discord.gg/keebs',
                instagram: 'instagram.com/keebs',
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    // club success case
    it('should create a club & return 201', async () => {
        const newClub = {
            school: mockObjectId,
            name: 'Keyboard Club',
            tagline: 'community for anyone interested in mechanical keyboards',
            description: 'Look out for our upcoming big event in fall quarter! :D',
            website: 'ucsdkeebs.com',
            discord: 'discord.gg/keebs',
            instagram: 'instagram.com/keebs',
        };
        mockClub.create.mockResolvedValue(newClub as any);

        await createClub(mockReq as Request, mockRes as Response);

        expect(mockClub.create).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newClub);
    });

    it('should cause an error and return 500', async () => {
        const error = new Error();

        mockClub.create.mockRejectedValue(error);

        await createClub(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error creating club' });
    });
});

/* testing joinClub */

describe('Join Club', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    beforeEach(() => {
        mockReq = {
            body: {
                user: mockObjectId,
                club: mockObjectId2,
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    // join club success case
    it('should create a new club-membership document & return 201', async () => {
        const newClubMembership = {
            user: mockObjectId,
            club: mockObjectId2,
        };
        mockClubMembership.create.mockResolvedValue(newClubMembership as any);

        await joinClub(mockReq as Request, mockRes as Response);

        expect(mockClubMembership.create).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newClubMembership);
    });

    // join club duplicate error case
    it('should throw an error & return 400', async () => {
        const copyClubMembership = {
            user: mockObjectId,
            club: mockObjectId2,
        };
        mockClubMembership.create.mockResolvedValue(copyClubMembership as any);

        await joinClub(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'User is already in club' });
    });

    it('should cause an error and return 500', async () => {
        const error = new Error();

        mockClubMembership.create.mockRejectedValue(error);

        await joinClub(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error joining club' });
    });
});
