import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const BoardRoleResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional().nullable(),
    scope: z.string(),
    isSystemRole: z.boolean(),
    permissions: z.array(z.string()),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
}).openapi({ description: 'Board Role Information' });

export const ListBoardRoleResponseSchema = z.array(BoardRoleResponseSchema);

export type BoardRoleResponseSchema = z.infer<typeof BoardRoleResponseSchema>;
