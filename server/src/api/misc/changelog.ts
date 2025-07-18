import { ApiEndpoint, AuthType } from '@/types/api-types';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorCode } from '@clubhive/shared';

export interface ChangelogVersion {
    version: string;
    date: string;
    changes: {
        type: 'added' | 'changed' | 'removed' | 'fixed' | 'misc';
        text: string;
    }[];
}

export interface ChangelogResponse {
    versions: ChangelogVersion[];
}

const parseMarkdownChangelog = (content: string): ChangelogVersion[] => {
    const versions: ChangelogVersion[] = [];
    const lines = content.split('\n');

    let currentVersion: ChangelogVersion | null = null;
    let currentSection: string | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.length === 0) continue;

        // Parse version headers like ## [v0.0.0] - 2025-07-11
        const versionMatch = trimmedLine.match(/^##\s*\[([^\]]+)]\s*-\s*(.+)$/);
        if (versionMatch) {
            if (currentVersion) versions.push(currentVersion);

            currentVersion = {
                version: versionMatch[1],
                date: versionMatch[2],
                changes: [],
            };
            currentSection = null;
            continue;
        }

        // Parse section headers like ### Added
        const sectionMatch = trimmedLine.match(/^###\s+(.+)$/);
        if (sectionMatch && currentVersion) {
            currentSection = sectionMatch[1].toLowerCase();
            continue;
        }

        // Parse change items like - Footer component with responsive design
        const changeMatch = trimmedLine.match(/^-\s+(.+)$/);
        if (changeMatch && currentVersion && currentSection) {
            const validTypes = ['added', 'changed', 'removed', 'fixed', 'misc'];
            const changeType = validTypes.includes(currentSection)
                ? (currentSection as any)
                : 'misc';

            currentVersion.changes.push({
                type: changeType,
                text: changeMatch[1],
            });
        }
    }

    // Add the last version
    if (currentVersion) versions.push(currentVersion);

    // Filter versions from the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return versions.filter(version => {
        const versionDate = new Date(version.date);
        return versionDate >= sixMonthsAgo;
    });
};

export const changelogEndpoint: ApiEndpoint<undefined, ChangelogResponse> = {
    path: '/api/changelog',
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
            const versions = parseMarkdownChangelog(content);

            const response: ChangelogResponse = {
                versions,
            };

            res.json({
                success: true,
                data: response,
            });
        } catch (error) {
            console.error('Error reading changelog:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to read changelog',
                    code: ErrorCode.NOT_FOUND,
                },
            });
        }
    },
};
