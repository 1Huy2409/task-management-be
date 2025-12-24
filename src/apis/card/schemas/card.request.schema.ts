import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateCardSchema = z.object({
    title: z.string().min(1).max(255).openapi({ description: 'Title of the card', example: 'Implement Login' }),
    description: z.string().optional().openapi({ description: 'Description of the card', example: 'Implement login using JWT' }),
    listId: z.string().uuid().openapi({ description: 'ID of the list the card belongs to', example: '123e4567-e89b-12d3-a456-426614174000' }),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium').openapi({ description: 'Priority of the card', example: 'medium' }),
    dueDate: z.string().datetime().optional().openapi({ description: 'Due date of the card', example: '2023-12-31T23:59:59Z' }),
    coverUrl: z.string().url().optional().openapi({ description: 'Cover URL of the card', example: 'https://example.com/cover.jpg' }),
});

export const PostCardRequest: ZodRequestBody = {
    description: 'Create new card',
    content: {
        'application/json': {
            schema: CreateCardSchema.openapi({ example: { title: 'Implement Login', listId: '123e4567-e89b-12d3-a456-426614174000' } })
        }
    }
}

export const UpdateCardSchema = z.object({
    title: z.string().min(1).max(255).optional().openapi({ description: 'Title of the card', example: 'Implement Login' }),
    description: z.string().optional().openapi({ description: 'Description of the card', example: 'Implement login using JWT' }),
    listId: z.string().uuid().optional().openapi({ description: 'ID of the list the card belongs to', example: '123e4567-e89b-12d3-a456-426614174000' }),
    priority: z.enum(['low', 'medium', 'high']).optional().openapi({ description: 'Priority of the card', example: 'high' }),
    dueDate: z.string().datetime().optional().openapi({ description: 'Due date of the card', example: '2023-12-31T23:59:59Z' }),
    coverUrl: z.string().url().optional().openapi({ description: 'Cover URL of the card', example: 'https://example.com/cover.jpg' }),
    position: z.number().optional().openapi({ description: 'Position of the card', example: 1 }),
});

export const PatchCardRequest: ZodRequestBody = {
    description: 'Update card',
    content: {
        'application/json': {
            schema: UpdateCardSchema.openapi({ example: { title: 'Implement Login (Updated)' } })
        }
    }
}

export type CreateCardSchema = z.infer<typeof CreateCardSchema>;
export type UpdateCardSchema = z.infer<typeof UpdateCardSchema>;
