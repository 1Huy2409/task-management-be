import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";

export const commentRegistry = new OpenAPIRegistry();

commentRegistry.registerPath({
  method: "post",
  path: "/api/v1/cards/{cardId}/comments",
  tags: ["Comment"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z
        .string()
        .uuid()
        .openapi({
          example: "123e4567-e89b-12d3-a456-426614174000",
        }),
    }),
    body: {
      description: "Create a new comment",
      content: {
        "application/json": {
          schema: z
            .object({
              content: z.string().openapi({ example: "This is a comment." }),
            })
            .openapi({
              example: {
                content: "This is a comment.",
              },
            }),
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({ id: z.string().uuid() }),
    "Comment created successfully"
  ),
});

commentRegistry.registerPath({
  method: "get",
  path: "/api/v1/comments/card/{cardId}",
  tags: ["Comment"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      cardId: z
        .string()
        .uuid()
        .openapi({
          example: "123e4567-e89b-12d3-a456-426614174000",
        }),
    }),
  },
  responses: createApiResponse(
    z.array(
      z.object({
        id: z.string().uuid(),
        content: z.string(),
        userId: z.string().uuid(),
      })
    ),
    "List of comments"
  ),
});

commentRegistry.registerPath({
  method: "patch",
  path: "/api/v1/comments/{id}",
  tags: ["Comment"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z
        .string()
        .uuid()
        .openapi({
          example: "987e6543-e21b-34d5-c678-123456789abc",
        }),
    }),
    body: {
      description: "Update a comment",
      content: {
        "application/json": {
          schema: z
            .object({
              content: z.string().openapi({ example: "Updated comment content." }),
            })
            .openapi({ example: { content: "Updated comment content." } }),
        },
      },
    },
  },
  responses: createApiResponse(
    z.object({ id: z.string().uuid() }),
    "Comment updated successfully"
  ),
});

commentRegistry.registerPath({
  method: "delete",
  path: "/api/v1/comments/{id}",
  tags: ["Comment"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({
      id: z
        .string()
        .uuid()
        .openapi({
          example: "987e6543-e21b-34d5-c678-123456789abc",
        }),
    }),
  },
  responses: createApiResponse(z.null(), "Comment deleted successfully"),
});