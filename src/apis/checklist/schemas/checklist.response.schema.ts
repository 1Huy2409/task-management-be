import { z } from "zod";

export const ChecklistItemResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    isChecked: z.boolean(),
    checklistId: z.string(),
    position: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const ChecklistResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    cardId: z.string(),
    items: z.array(ChecklistItemResponseSchema).optional(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type ChecklistItemResponseSchema = z.infer<typeof ChecklistItemResponseSchema>;
export type ChecklistResponseSchema = z.infer<typeof ChecklistResponseSchema>;
