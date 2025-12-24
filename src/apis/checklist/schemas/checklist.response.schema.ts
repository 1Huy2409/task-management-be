import { z } from "zod";

export const ChecklistItemResponseSchema = z.object({
    id: z.string().uuid().openapi({ example: 'uuid-item' }),
    title: z.string().openapi({ example: 'Buy milk' }),
    isChecked: z.boolean().openapi({ example: false }),
    checklistId: z.string().uuid().openapi({ example: 'uuid-checklist' }),
    position: z.number().openapi({ example: 1000 }),
    createdAt: z.date().openapi({ example: '2023-01-01T00:00:00Z' }),
    updatedAt: z.date().openapi({ example: '2023-01-01T00:00:00Z' })
}).openapi('ChecklistItem');

export const ChecklistResponseSchema = z.object({
    id: z.string().uuid().openapi({ example: 'uuid-checklist' }),
    title: z.string().openapi({ example: 'To Do' }),
    cardId: z.string().uuid().openapi({ example: 'uuid-card' }),
    items: z.array(ChecklistItemResponseSchema).optional(),
    createdAt: z.date().openapi({ example: '2023-01-01T00:00:00Z' }),
    updatedAt: z.date().openapi({ example: '2023-01-01T00:00:00Z' })
}).openapi('Checklist');

export type ChecklistItemResponseSchema = z.infer<typeof ChecklistItemResponseSchema>;
export type ChecklistResponseSchema = z.infer<typeof ChecklistResponseSchema>;
