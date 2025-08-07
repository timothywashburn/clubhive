import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Auth from '@/models/auth-schema';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const loginEndpoint: ApiEndpoint<LoginRequest, LoginResponse> = {
    path: '/api/user/login',
    method: 'post',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        const { email, password } = req.body;

        const auth = await Auth.findOne({ email: email });
        if (!auth) {
            res.status(409).json({
                success: false,
                error: {
                    message: 'Email is not registered',
                    code: ErrorCode.INVALID_INPUT,
                },
            });
            return;
        }
        try {
            if (await bcrypt.compare(password, auth.password)) {
                const REFRESH_TOKEN_SECRET = 'temp refresh'; // real token should go in .env
                const ACCESS_TOKEN_SECRET = 'temp access';

                const accessToken = jwt.sign({ authId: auth._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                const refreshToken = jwt.sign({ authId: auth._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                // Store refresh token in HTTP-only cookie
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true, // Prevents XSS attacks
                    secure: process.env.NODE_ENV === 'development', // HTTPS only in dev; change to production
                    sameSite: 'strict', // CSRF protection
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    path: '/',
                });

                res.json({
                    success: true,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            } else {
                res.status(409).json({
                    success: false,
                    error: {
                        message: 'Incorrect Password',
                        code: ErrorCode.INVALID_INPUT,
                    },
                });
                return;
            }
        } catch (error) {
            console.error('Error logging in:', error);
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

/* logout for future ref; will implement after i get signup/login working */

/*
// logout function will delete refreshToken 
export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        res.status(201).json("Logged out successfully");
    } catch (error) {
        res.status(400).json({ error : "Logout failed "});
    }
}
*/
