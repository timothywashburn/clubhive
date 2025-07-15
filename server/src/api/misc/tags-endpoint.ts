import { ApiEndpoint, AuthType } from '@/types/api-types';
import { ErrorCode } from '@clubhive/shared';
import Tag from '@/models/tag-schema';
import { TagData } from '@/models/tag-schema';

export type GetTagsRequest = Record<string, unknown>;
export interface GetTagsResponse {
    tags: TagData[];
}

export const getTagsEndpoint: ApiEndpoint<GetTagsRequest, GetTagsResponse> = {
    path: '/api/tags',
    method: 'get',
    auth: AuthType.NONE,
    handler: async (req, res) => {
        try {
            const tags = await Tag.find().exec();

            res.json({
                success: true,
                data: { tags },
            });
        } catch (err) {
            console.error('Failed to fetch tags:', err);
            const message =
                err instanceof Error ? err.message : 'Unknown error';
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch tags',
                    code: ErrorCode.INTERNAL_SERVER_ERROR,
                    details:
                        process.env.NODE_ENV === 'development'
                            ? message
                            : undefined,
                },
            });
        }
    },
};
