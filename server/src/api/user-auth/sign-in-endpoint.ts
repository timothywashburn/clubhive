import { ErrorCode } from '@clubhive/shared';
import { ApiEndpoint, AuthType } from '@/types/api-types';
import bcrypt from 'bcrypt';
import Auth from '@/models/auth-schema';
import AuthManager from '@/managers/auth-manager';
import dotenv from 'dotenv';

dotenv.config();

interface SignInRequest {
    email: string;
    password: string;
}

interface SignInResponse {
    accessToken: string;
    refreshToken: string;
}

export const signInEndpoint: ApiEndpoint<SignInRequest, SignInResponse> = {
    path: '/api/user/sign-in',
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
                const { accessToken, refreshToken } = await AuthManager.generateTokenPair(auth._id.toString(), auth.userId.toString());

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
