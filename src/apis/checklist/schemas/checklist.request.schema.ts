import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CreateChecklistSchema = z.object({
    title: z.string().min(1, "Title is required").max(255).openapi({ example: "To Do List" }),
    cardId: z.string().uuid().openapi({ example: "uuid-of-card" })
});

export const UpdateChecklistSchema = z.object({
    title: z.string().min(1).max(255).optional()
});

export const CreateChecklistItemSchema = z.object({
    title: z.string().min(1).max(255).openapi({ example: "Buy milk" }),
    checklistId: z.string().uuid().openapi({ example: "uuid-of-checklist" })
});

export const UpdateChecklistItemSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    isChecked: z.boolean().optional()
});

export type CreateChecklistSchema = z.infer<typeof CreateChecklistSchema>;
export type UpdateChecklistSchema = z.infer<typeof UpdateChecklistSchema>;
export type CreateChecklistItemSchema = z.infer<typeof CreateChecklistItemSchema>;
export type UpdateChecklistItemSchema = z.infer<typeof UpdateChecklistItemSchema>;
