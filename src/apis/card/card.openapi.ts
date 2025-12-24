import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import z from "zod";
import { CardResponseSchema } from "./schemas/card.response.schema";
import { PostCardRequest, PatchCardRequest } from "./schemas/card.request.schema";

export const cardRegistry = new OpenAPIRegistry();

cardRegistry.register('Card', CardResponseSchema);

export function registerCardPaths() {
    // Create Card
    cardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/cards',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            body: PostCardRequest
        },
        responses: createApiResponse(CardResponseSchema, 'Success')
    });

    // Get All Cards (by listId)
    cardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/cards',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            query: z.object({
                listId: z.string().uuid().openapi({ description: 'List ID' })
            })
        },
        responses: createApiResponse(z.array(CardResponseSchema), 'Success')
    });

    // Get Card by ID
    cardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/cards/{id}',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: createApiResponse(CardResponseSchema, 'Success')
    });

    // Update Card (Move/Reorder)
    cardRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/cards/{id}',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: PatchCardRequest
        },
        responses: createApiResponse(CardResponseSchema, 'Success')
    });

    // Delete Card
    cardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/cards/{id}',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    });

    // Assign Member
    cardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/cards/{id}/members',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid()
            }),
            body: {
                description: 'Assign user to card',
                content: {
                    'application/json': {
                        schema: z.object({ userId: z.string().uuid() })
                    }
                }
            }
        },
        responses: createApiResponse(z.null(), 'Success')
    });

    // Remove Member
    cardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/cards/{id}/members/{userId}',
        tags: ['Card'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.string().uuid(),
                userId: z.string().uuid()
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    });
}
