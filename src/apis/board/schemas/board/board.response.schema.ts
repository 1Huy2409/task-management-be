import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { BoardVisibility, BoardStatus } from '@/common/entities/board.entity';

extendZodWithOpenApi(z);

export const BoardResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    title: z.string().min(1).max(255).openapi({ example: 'Project Alpha' }),
    description: z.string().max(1000).nullable().optional().openapi({ example: 'This is a sample board description.' }),
    coverUrl: z.url().min(10).max(255).optional().openapi({ example: 'https://example.com/cover.jpg' }),
    visibility: z.enum(BoardVisibility).openapi({ example: BoardVisibility.WORKSPACE }),
    ownerId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    status: z.enum(BoardStatus).openapi({ example: BoardStatus.ACTIVE }),
    workspaceId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
})

export const ListBoardResponseSchema = z.array(BoardResponseSchema);

export const BoardTemplateSchema = z.object({
    id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    name: z.string().openapi({ example: 'Kanban Board' }),
    description: z.string().nullable().openapi({ example: 'A simple Kanban board with To Do, In Progress, and Done lists.' }),
    coverUrl: z.string().nullable().openapi({ example: 'https://example.com/cover.jpg' }),
    type: z.string().openapi({ example: 'SYSTEM' }),
    createdAt: z.date().openapi({ example: new Date() }),
    updatedAt: z.date().openapi({ example: new Date() })
})

export const ListBoardTemplateSchema = z.array(BoardTemplateSchema);
;
export type ListBoardResponse = z.infer<typeof ListBoardResponseSchema>;
export type BoardResponse = z.infer<typeof BoardResponseSchema>;