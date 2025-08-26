import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { AuthInfo } from '@clubhive/shared';

export interface TokenPayload {
    authId: string;
    userId: string;
}

export interface AccessTokens {
    accessToken: string;
    refreshToken: string;
}

export class AuthManager {
    private static instance: AuthManager;

    private constructor() {}

    static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }

    generateTokenPair(authId: string, userId: string): AccessTokens {
        const payload: TokenPayload = { authId, userId };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    refreshAccessToken(refreshToken: string): string {
        const decoded = this.verifyRefreshToken(refreshToken);
        const payload: TokenPayload = {
            authId: decoded.authId,
            userId: decoded.userId,
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: '15m',
        });
    }

    verifyRefreshToken(refreshToken: string): TokenPayload {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
            return {
                authId: decoded.authId,
                userId: decoded.userId,
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    verifyAccessToken(accessToken: string): TokenPayload {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as any;
            return {
                authId: decoded.authId,
                userId: decoded.userId,
            };
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    setRefreshTokenCookie(res: Response, refreshToken: string): void {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
        });
    }

    clearRefreshTokenCookie(res: Response): void {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });
    }

    toAuthInfo(payload: TokenPayload): AuthInfo {
        return {
            authId: payload.authId,
            userId: payload.userId,
        };
    }
}

export default AuthManager.getInstance();
