import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const CardResponseSchema = z.object({
    id: z.string().uuid().openapi({ description: 'Unique identifier for the card', example: '123e4567-e89b-12d3-a456-426614174000' }),
    title: z.string().min(1).max(255).openapi({ description: 'Title of the card', example: 'Implement Login' }),
    description: z.string().nullable().openapi({ description: 'Description of the card', example: 'Implement login using JWT' }),
    position: z.number().openapi({ description: 'Position of the card', example: 1 }),
    priority: z.enum(['low', 'medium', 'high']).openapi({ description: 'Priority of the card', example: 'medium' }),
    dueDate: z.string().nullable().openapi({ description: 'Due date of the card', example: '2023-12-31T23:59:59Z' }),
    coverUrl: z.string().nullable().openapi({ description: 'Cover URL of the card', example: 'https://example.com/cover.jpg' }),
    listId: z.string().uuid().openapi({ description: 'ID of the list the card belongs to', example: '123e4567-e89b-12d3-a456-426614174000' }),
    createdAt: z.date().openapi({ description: 'Creation date', example: '2023-01-01T00:00:00Z' }),
    updatedAt: z.date().openapi({ description: 'Last update date', example: '2023-01-02T00:00:00Z' }),
});

export type CardResponseSchema = z.infer<typeof CardResponseSchema>;
export type CardResponse = z.infer<typeof CardResponseSchema>;
