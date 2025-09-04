import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { AuthInfo } from '@clubhive/shared';
import { ConfigManager } from '@/services/config-manager';

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

    async generateTokenPair(authId: string, userId: string): Promise<AccessTokens> {
        const config = await ConfigManager.getConfig();
        const payload: TokenPayload = { authId, userId };

        const accessToken = jwt.sign(payload, config.jwtSecret, {
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(payload, config.jwtSecret, {
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    async refreshAccessToken(refreshToken: string): Promise<string> {
        const config = await ConfigManager.getConfig();
        const decoded = await this.verifyRefreshToken(refreshToken);
        const payload: TokenPayload = {
            authId: decoded.authId,
            userId: decoded.userId,
        };

        return jwt.sign(payload, config.jwtSecret, {
            expiresIn: '15m',
        });
    }

    async verifyRefreshToken(refreshToken: string): Promise<TokenPayload> {
        try {
            const config = await ConfigManager.getConfig();
            const decoded = jwt.verify(refreshToken, config.jwtSecret) as any;
            return {
                authId: decoded.authId,
                userId: decoded.userId,
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    async verifyAccessToken(accessToken: string): Promise<TokenPayload> {
        try {
            const config = await ConfigManager.getConfig();
            const decoded = jwt.verify(accessToken, config.jwtSecret) as any;
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
