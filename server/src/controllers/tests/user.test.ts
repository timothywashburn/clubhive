// testing controllers directly using jest
import { Request, Response } from 'express';
import { createUser } from '../user-controller';
import mongoose from 'mongoose';

jest.mock('../models/User');
jest.mock('../models/Auth');
const mockObjectId = new mongoose.Types.ObjectId();
import User from '../../models/user-schema';
import Auth from '../../models/auth-schema';
import { EducationType, Year } from '../../models/user-schema';

const mockUser = User as jest.Mocked<typeof User>;
const mockAuth = Auth as jest.Mocked<typeof Auth>;

describe('User Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    beforeEach(() => {
        mockReq = {
            // input
            body: {
                name: 'New User',
                school: mockObjectId,
                major: 'Undeclared',
                educationType: EducationType.UNDERGRADUATE,
                year: Year.FIRST,
                email: 'newUser@example.com',
                password: 'password',
            },
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    // user success case
    it('should create an user & return 201', async () => {
        const newUser = {
            // expected output
            name: 'New User',
            school: mockObjectId,
            major: 'Undeclared',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.FIRST,
        };

        const newAuth = {
            email: 'newUser@example.com',
            password: 'password',
            emailVerified: false,
        };
        const result = mockUser.create.mockResolvedValue(newUser as any);
        const result2 = mockAuth.create.mockResolvedValue(newAuth as any);

        await createUser(mockReq as Request, mockRes as Response);

        expect(mockUser.create).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ newUser: result, newAuth: result2 });
    });

    it('should state that user already exists and return 400', async () => {
        await createUser(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should cause an error and return 500', async () => {
        const error = new Error();

        mockUser.create.mockRejectedValue(error);

        await createUser(mockReq as Request, mockRes as Response);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error creating user' });
    });
});
