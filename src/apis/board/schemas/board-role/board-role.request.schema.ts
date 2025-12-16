import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const PostBoardRoleSchema = z.object({
    name: z.string().min(1).max(50).openapi({ description: 'Name of the role', example: 'Manager' }),
    description: z.string().optional().openapi({ description: 'Description of the role', example: 'Board Manager Role' }),
    permissions: z.array(z.string()).openapi({ description: 'List of permission keys', example: ['board:view', 'board:update'] })
});

export const PatchBoardRoleSchema = z.object({
    name: z.string().min(1).max(50).optional().openapi({ description: 'Name of the role', example: 'Manager' }),
    description: z.string().optional().openapi({ description: 'Description of the role', example: 'Board Manager Role' }),
    permissions: z.array(z.string()).optional().openapi({ description: 'List of permission keys', example: ['board:view', 'board:update'] })
});

export const PostBoardRoleRequest: ZodRequestBody = {
    description: 'Create new board role',
    content: {
        'application/json': {
            schema: PostBoardRoleSchema
        }
    }
};

export const PatchBoardRoleRequest: ZodRequestBody = {
    description: 'Update board role',
    content: {
        'application/json': {
            schema: PatchBoardRoleSchema
        }
    }
};

export type PostBoardRoleSchema = z.infer<typeof PostBoardRoleSchema>;
export type PatchBoardRoleSchema = z.infer<typeof PatchBoardRoleSchema>;
