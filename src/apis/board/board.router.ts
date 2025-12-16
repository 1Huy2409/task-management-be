import { z } from "zod";
import { Router } from "express";
import BoardController from "./board.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
    BoardResponseSchema,
    ListBoardResponseSchema,
    BoardTemplateSchema,
    BoardTemplateDetailSchema,
    ListBoardTemplateSchema,
    PostBoardWithWorkspaceRequest,
    PatchBoardRequest,
    PostBoardJoinLinkRequest,
    BoardJoinLinkResponseSchema,
    ListBoardJoinLinkResponseSchema,
    PostJoinBoardByLinkRequest,
    PostInviteByEmailRequest,
    PostBoardRoleRequest,
    PatchBoardRoleRequest,
    ListBoardRoleResponseSchema,
    BoardRoleResponseSchema
} from "./schemas";
import { ListResponseSchema } from "../list/schemas/list.response.schema";
import { createApiResponse } from '@/api-docs/openAPIResponseBuilder';
import { checkAuthentication } from "@/common/middleware/authentication";
import { checkBoardPermission, checkWorkspacePermission } from "@/common/middleware/authorization";
import { PERMISSIONS } from "@/common/constants/permissions";
import { CopyListRequest, MoveListRequest, PostListRequest, ReorderListRequest } from "../list/schemas/list.request.schema";
import { PostBoardTemplateRequest, PostCreateTemplateFromBoardRequest } from "./schemas/board-template/board-template.request.schema";

export const boardRegistry = new OpenAPIRegistry()
boardRegistry.register('Board', BoardResponseSchema)
boardRegistry.register('BoardTemplate', BoardTemplateSchema)
boardRegistry.register('BoardJoinLink', BoardJoinLinkResponseSchema)
export default function boardRouter(boardController: BoardController): Router {
    const router: Router = Router()

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/templates',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(ListBoardTemplateSchema, 'Success')
    })
    router.get('/templates', asyncHandler(boardController.getAllTemplates))

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/templates/{id}',
        tags: ['BoardTemplate'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' })
            })
        },
        responses: createApiResponse(BoardTemplateDetailSchema, 'Success')
    })
    router.get('/templates/:id', asyncHandler(boardController.getTemplateById))

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/templates',
        tags: ['BoardTemplate'],
        security: [{ bearerAuth: [] }],
        request: {
            body: PostBoardTemplateRequest
        },
        responses: createApiResponse(BoardTemplateSchema, 'Success')
    })
    router.post('/templates',
        asyncHandler(checkAuthentication),
        // Add permission check if needed, e.g. checkWorkspacePermission(PERMISSIONS.TEMPLATE_CREATE) 
        // For now just auth or maybe admin only? User didn't specify, likely standard user or admin.
        asyncHandler(boardController.createTemplate))

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{boardId}/create-template',
        tags: ['BoardTemplate'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                boardId: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            }),
            body: PostCreateTemplateFromBoardRequest
        },
        responses: createApiResponse(BoardTemplateSchema, 'Success')
    })
    router.post('/:boardId/create-template',
        asyncHandler(checkAuthentication),
        // Allow board view permission to create template from it? Or manage?
        // Safe bet: BOARD_VIEW is minimum, but creating a template is harmless to the board itself.
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_VIEW)),
        asyncHandler(boardController.createTemplateFromBoard))

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/public',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(ListBoardResponseSchema, 'Success')
    })
    router.get('/public', asyncHandler(boardController.getAllPublicBoards))

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            body: PostBoardWithWorkspaceRequest
        },
        responses: createApiResponse(BoardResponseSchema, 'Success')
    })
    router.post('/',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.BOARD_CREATE)),
        asyncHandler(boardController.createBoard))

    // Begin manage lists - must be defined before /:id routes to avoid param conflicts
    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{boardId}/lists',
        tags: ['List'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                boardId: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            }),
            body: PostListRequest
        },
        responses: createApiResponse(ListResponseSchema, 'Success')
    })
    router.post('/:boardId/lists',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.LIST_CREATE)),
        asyncHandler(boardController.createList))

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/public/{id}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(ListBoardResponseSchema, 'Success')
    })
    router.get('/public/:id', asyncHandler(boardController.getPublicBoardById))

    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_DELETE)),
        asyncHandler(boardController.deleteBoard))

    boardRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/boards/{id}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            }),
            body: PatchBoardRequest
        },
        responses: createApiResponse(BoardResponseSchema, 'Success')
    })
    router.patch('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_UPDATE)),
        asyncHandler(boardController.updateBoard))

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/{id}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(BoardResponseSchema, 'Success')
    })
    router.get('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_VIEW)),
        asyncHandler(boardController.getBoardById))

    // Board invite routes
    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/invite/link',
        tags: ['Board', 'Invite'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            }),
            body: PostBoardJoinLinkRequest
        },
        responses: createApiResponse(BoardJoinLinkResponseSchema, 'Success')
    })
    router.post('/:id/invite/link',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_MEMBERS)),
        asyncHandler(boardController.createBoardJoinLink))

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/join',
        tags: ['Board', 'Invite'],
        security: [{ bearerAuth: [] }],
        request: {
            body: PostJoinBoardByLinkRequest
        },
        responses: createApiResponse(z.object({ message: z.string() }), 'Success')
    })
    router.post('/join',
        asyncHandler(checkAuthentication),
        asyncHandler(boardController.joinBoardByLink))

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/{id}/invite/links',
        tags: ['Board', 'Invite'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(ListBoardJoinLinkResponseSchema, 'Success')
    })
    router.get('/:id/invite/links',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_VIEW_MEMBERS)),
        asyncHandler(boardController.getBoardJoinLinks))

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/{boardId}/lists',
        tags: ['List'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                boardId: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(z.array(ListResponseSchema), 'Success')
    })
    router.get('/:boardId/lists',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.LIST_VIEW)),
        asyncHandler(boardController.getListsByBoardId))
    // Get board members
    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/{id}/members',
        tags: ['Board'],
        summary: 'Get all members of a board',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: {
            200: {
                description: 'Board members retrieved successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: z.boolean(),
                            data: z.array(z.object({
                                id: z.string(),
                                userId: z.string(),
                                username: z.string().optional(),
                                fullname: z.string().optional(),
                                email: z.string().optional(),
                                avatarUrl: z.string().optional().nullable(),
                                roleId: z.string(),
                                roleName: z.string().optional(),
                                joinedAt: z.date()
                            }))
                        })
                    }
                }
            }
        }
    })

    router.get('/:id/members',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_VIEW)),
        asyncHandler(boardController.getBoardMembers))

    boardRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/boards/{id}/invite/link/{linkId}/revoke',
        tags: ['Board', 'Invite'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                }),
                linkId: z.uuid().openapi({
                    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                    description: 'Join Link UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(z.object({ message: z.string() }), 'Success')
    })
    router.patch('/:id/invite/link/:linkId/revoke',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_MEMBERS)),
        asyncHandler(boardController.revokeBoardJoinLink))

    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}/invite/link/{linkId}',
        tags: ['Board', 'Invite'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                }),
                linkId: z.uuid().openapi({
                    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                    description: 'Join Link UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(z.object({ message: z.string() }), 'Success')
    })
    router.delete('/:id/invite/link/:linkId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_MEMBERS)),
        asyncHandler(boardController.deleteBoardJoinLink))

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/invite/email',
        tags: ['Board', 'Invite'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            }),
            body: PostInviteByEmailRequest
        },
        responses: createApiResponse(z.object({ message: z.string() }), 'Success')
    })
    router.post('/:id/invite/email',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_MEMBERS)),
        asyncHandler(boardController.inviteByEmail))

    // reopen archived board
    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/reopen',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/:id/reopen',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_UPDATE)),
        asyncHandler(boardController.reopenBoard))


    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}/permanent',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id/permanent',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_DELETE)),
        asyncHandler(boardController.deletePermanent))


    const ChangeOwnerBody = z.object({ ownerId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }) });
    const PostChangeOwnerRequest = {
        description: 'Change board owner',
        content: {
            'application/json': {
                schema: ChangeOwnerBody.openapi({ example: { ownerId: '123e4567-e89b-12d3-a456-426614174000' } })
            }
        }
    };

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/change-owner',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() }),
            body: PostChangeOwnerRequest
        },
        responses: createApiResponse(BoardResponseSchema, 'Success')
    })
    router.post('/:id/change-owner',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_UPDATE)),
        asyncHandler(boardController.changeOwner))

    // Board Roles Management
    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/{id}/roles',
        tags: ['Board', 'Role'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() })
        },
        responses: createApiResponse(ListBoardRoleResponseSchema, 'Success')
    })
    router.get('/:id/roles',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_VIEW)), // Or special permission?
        asyncHandler(boardController.getBoardRoles))

    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/roles',
        tags: ['Board', 'Role'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() }),
            body: PostBoardRoleRequest
        },
        responses: createApiResponse(BoardRoleResponseSchema, 'Success')
    })
    router.post('/:id/roles',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_ROLES)), // Permission check
        asyncHandler(boardController.createBoardRole))

    boardRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/boards/{id}/roles/{roleId}',
        tags: ['Board', 'Role'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid(), roleId: z.uuid() }),
            body: PatchBoardRoleRequest
        },
        responses: createApiResponse(BoardRoleResponseSchema, 'Success')
    })
    router.patch('/:id/roles/:roleId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_ROLES)),
        asyncHandler(boardController.updateBoardRole))

    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}/roles/{roleId}',
        tags: ['Board', 'Role'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid(), roleId: z.uuid() })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id/roles/:roleId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_ROLES)),
        asyncHandler(boardController.deleteBoardRole))

    // Board Member Role Management
    boardRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/boards/{id}/members/{userId}',
        tags: ['Board', 'Member'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid(), userId: z.uuid() }),
            body: {
                description: 'Update member role',
                content: {
                    'application/json': {
                        schema: z.object({ roleId: z.string().uuid() })
                    }
                }
            }
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.patch('/:id/members/:userId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_ROLES)),
        asyncHandler(boardController.updateMemberRole))

    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}/members/{userId}',
        tags: ['Board', 'Member'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid(), userId: z.uuid() })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id/members/:userId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_MANAGE_MEMBERS)), // Or manage roles?
        asyncHandler(boardController.removeMember))

    return router;
}