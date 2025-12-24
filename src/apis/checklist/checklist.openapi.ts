import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import z from "zod";
import { ChecklistResponseSchema, ChecklistItemResponseSchema } from "./schemas/checklist.response.schema";
import { PostChecklistRequest, PostChecklistItemRequest, PatchChecklistItemRequest } from "./schemas/checklist.request.schema";

export const checklistRegistry = new OpenAPIRegistry();

checklistRegistry.register('Checklist', ChecklistResponseSchema);
checklistRegistry.register('ChecklistItem', ChecklistItemResponseSchema);

export function registerChecklistPaths() {
    // Create Checklist
    checklistRegistry.registerPath({
        method: 'post',
        path: '/api/v1/checklists',
        tags: ['Checklist'],
        security: [{ bearerAuth: [] }],
        request: {
            body: PostChecklistRequest
        },
        responses: createApiResponse(ChecklistResponseSchema, 'Success')
    });

    // Delete Checklist
    checklistRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/checklists/{id}',
        tags: ['Checklist'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    });

    // Create Checklist Item (Checklist ID in params)
    checklistRegistry.registerPath({
        method: 'post',
        path: '/api/v1/checklists/{id}/items',
        tags: ['Checklist'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({ description: 'Checklist ID' })
            }),
            body: PostChecklistItemRequest
        },
        responses: createApiResponse(ChecklistItemResponseSchema, 'Success')
    });

    // Update Checklist Item
    checklistRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/checklists/items/{id}',
        tags: ['Checklist'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({ description: 'Item ID' })
            }),
            body: PatchChecklistItemRequest
        },
        responses: createApiResponse(ChecklistItemResponseSchema, 'Success')
    });

    // Delete Checklist Item
    checklistRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/checklists/items/{id}',
        tags: ['Checklist'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid().openapi({ description: 'Item ID' })
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    });
}
