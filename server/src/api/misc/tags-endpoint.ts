import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode, TagData } from '@clubhive/shared';
import Tag from '@/models/tag-schema';
import { serializeRecursive } from '@/utils/db-doc-utils';

export interface GetTagsResponse {
    tags: TagData[];
}

export const getTagsEndpoint: ApiEndpoint<undefined, GetTagsResponse> = {
    path: '/api/tags',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const tags = await Tag.find().exec();

            res.json({
                success: true,
                data: {
                    tags: serializeRecursive(tags),
                },
            });
        } catch (err) {
            console.error('Failed to fetch tags:', err);
            const message = err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch tags',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details: process.env.NODE_ENV === 'development' ? message : undefined,
                },
            });
        }
    },
};
