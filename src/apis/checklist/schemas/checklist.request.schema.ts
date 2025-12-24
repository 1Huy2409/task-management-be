import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CreateChecklistSchema = z.object({
    title: z.string().min(1, "Title is required").max(255).openapi({ description: 'Checklist title', example: "To Do List" }),
    cardId: z.string().uuid().openapi({ description: 'Card ID', example: "uuid-of-card" })
});

export const PostChecklistRequest = {
    description: 'Create new checklist',
    content: {
        'application/json': {
            schema: CreateChecklistSchema
        }
    }
};

export const UpdateChecklistSchema = z.object({
    title: z.string().min(1).max(255).optional().openapi({ description: 'New title', example: "Updated List" })
});

export const CreateChecklistItemSchema = z.object({
    title: z.string().min(1).max(255).openapi({ description: 'Item title', example: "Buy milk" }),
    checklistId: z.string().uuid().optional().openapi({ description: 'Checklist ID (Optional if in params)', example: "uuid-of-checklist" })
});

export const PostChecklistItemRequest = {
    description: 'Create new checklist item',
    content: {
        'application/json': {
            schema: CreateChecklistItemSchema
        }
    }
};

export const UpdateChecklistItemSchema = z.object({
    title: z.string().min(1).max(255).optional().openapi({ description: 'Item title', example: "Buy almond milk" }),
    isChecked: z.boolean().optional().openapi({ description: 'Checked status', example: true })
});

export const PatchChecklistItemRequest = {
    description: 'Update checklist item',
    content: {
        'application/json': {
            schema: UpdateChecklistItemSchema
        }
    }
};

export type CreateChecklistSchema = z.infer<typeof CreateChecklistSchema>;
export type UpdateChecklistSchema = z.infer<typeof UpdateChecklistSchema>;
export type CreateChecklistItemSchema = z.infer<typeof CreateChecklistItemSchema>;
export type UpdateChecklistItemSchema = z.infer<typeof UpdateChecklistItemSchema>;
