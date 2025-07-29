import { ApiEndpoint, AuthType } from '@/types/api-types';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorCode } from '@clubhive/shared';

export interface VersionResponse {
    currentVersion: string;
}

const getCurrentVersion = (content: string): string => {
    const lines = content.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        const versionMatch = trimmedLine.match(/^##\s*\[([^\]]+)]\s*-\s*(.+)$/);
        if (versionMatch) return versionMatch[1];
    }

    return 'Unknown';
};

export const versionEndpoint: ApiEndpoint<undefined, VersionResponse> = {
    path: '/api/version',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const changelogPath = path.join(process.cwd(), '/CHANGELOG.md');

            if (!fs.existsSync(changelogPath)) {
                res.status(404).json({
                    success: false,
                    error: {
                        message: 'Changelog file not found',
                        code: ErrorCode.NOT_FOUND,
                    },
                });
                return;
            }

            const content = fs.readFileSync(changelogPath, 'utf-8');
            const currentVersion = getCurrentVersion(content);

            res.json({
                success: true,
                currentVersion,
            });
        } catch (error) {
            console.error('Error reading version:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to read changelog',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                },
            });
        }
    },
};
