// testing controllers directly using jest
import { Request, Response } from 'express';
import { createUser } from '../user-controller';
import mongoose from 'mongoose';

jest.mock('../models/User');
const mockObjectId = new mongoose.Types.ObjectId();
import User from '../../models/user-schema';
import { EducationType, Year } from '../../models/user-schema';

const mockUser = User as jest.Mocked<typeof User>;
const mockUserCopy = User as jest.Mocked<typeof User>;

describe('User Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    beforeEach(() => {
        mockReq = {
            body: {
                name: 'New User',
                school: mockObjectId,
                major: 'Undeclared',
                educationType: 'Undergraduate',
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
            name: 'New User',
            school: mockObjectId,
            major: 'Undeclared',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.FIRST,
            email: 'newUser@example.com',
            password: 'password',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockUser.create.mockResolvedValue(newUser as any);

        await createUser(mockReq as Request, mockRes as Response);

        expect(mockUser.create).toHaveBeenCalledWith(mockReq.body);
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(newUser);

        // this shouldnt work bc the test needs to account for the auth document
    });

    it('should state that user already exists and return 400', async () => {
        const copyUser = {
            name: 'New User',
            school: mockObjectId,
            major: 'Undeclared',
            educationType: EducationType.UNDERGRADUATE,
            year: Year.FIRST,
            email: 'newUser@example.com',
            password: 'password',
        };
        mockUserCopy.create.mockResolvedValue(copyUser as any);

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
