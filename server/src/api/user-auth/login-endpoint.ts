import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import bcrypt from 'bcrypt';
import Auth from '@/models/auth-schema';
import AuthManager from '@/managers/auth-manager';
import dotenv from 'dotenv';

dotenv.config();

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
                const { accessToken, refreshToken } = AuthManager.generateTokenPair(auth._id.toString(), auth.userId.toString());

                AuthManager.setRefreshTokenCookie(res, refreshToken);

                res.json({
                    success: true,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });
            } else {
                res.status(401).json({
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
