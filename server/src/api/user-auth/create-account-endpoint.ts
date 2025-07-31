import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import bcrypt from 'bcrypt';
import User from '@/models/user-schema';
import Auth from '@/models/auth-schema';

interface CreateAccountRequest {
    name: string;
    school: string;
    major: string;
    educationType: string;
    year: string;
    email: string;
    password: string;
}

interface CreateAccountResponse {
    authId: string;
}

export const createAccountEndpoint: ApiEndpoint<CreateAccountRequest, CreateAccountResponse> = {
    path: '/api/user/create-account',
    method: 'post',
    auth: AuthType.AUTHENTICATED,
    handler: async (req, res) => {
        const { name, school, major, educationType, year, email, password } = req.body;

        try {
            const existing = await Auth.findOne({ email: email });
            if (existing) {
                res.status(409).json({
                    success: false,
                    error: {
                        message: 'User already registered',
                        code: ErrorCode.INVALID_INPUT,
                    },
                });
                return;
            }

            // hashing password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name: name,
                school: school,
                major: major,
                educationType: educationType,
                year: year,
            });
            await newUser.save();

            const newAuth = new Auth({
                email: email,
                password: hashedPassword,
                emailVerified: false,
                userId: newUser._id,
            });
            const result = await newAuth.save();

            res.json({
                success: true,
                data: { authId: result._id.toString() },
            });
        } catch (error) {
            console.error('Error creating new user:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Internal server error',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                },
            });
        }
    },
};
