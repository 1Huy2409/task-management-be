import { Router } from 'express';
import { CommentService } from './comment.service';
import { CommentRepository } from './repositories/comment.repository';
import { AppDataSource } from '@/config/db.config';
import { Comment } from '@/common/entities/comment.entity';
import { CommentResponseSchema, ListCommentResponseSchema, CreateCommentRequestSchema, UpdateCommentRequestSchema } from '@/apis/comment/schemas';
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { z } from "zod";

const commentRouter: Router = Router();
const commentRepository = new CommentRepository(AppDataSource);
const commentService = new CommentService(commentRepository);

export const commentRegistry = new OpenAPIRegistry();

commentRegistry.registerPath({
  method: "post",
  path: "/api/v1/comments",
  tags: ["Comment"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCommentRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(CommentResponseSchema, "Comment created successfully"),
});

commentRegistry.registerPath({
  method: "get",
  path: "/api/v1/comments/card/{cardId}",
  tags: ["Comment"],
  request: {
    params: z.object({
      cardId: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    }),
  },
  responses: createApiResponse(ListCommentResponseSchema, "Comments retrieved successfully"),
});

commentRegistry.registerPath({
  method: "patch",
  path: "/api/v1/comments/{id}",
  tags: ["Comment"],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateCommentRequestSchema,
        },
      },
    },
  },
  responses: createApiResponse(CommentResponseSchema, "Comment updated successfully"),
});

commentRegistry.registerPath({
  method: "delete",
  path: "/api/v1/comments/{id}",
  tags: ["Comment"],
  request: {
    params: z.object({
      id: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    }),
  },
  responses: {
    204: {
      description: "Comment deleted successfully",
    },
  },
});

commentRouter.post('/card/:cardId/comments', async (req, res) => {
  const { cardId } = req.params;
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = req.user.id; // Extracted from authentication middleware
  const data = CreateCommentRequestSchema.omit({ userId: true, cardId: true }).parse(req.body);

  const comment = await commentService.createComment({ ...data, cardId, userId });
  res.status(201).json(CommentResponseSchema.parse(comment));
});

commentRouter.get('/card/:cardId', async (req, res) => {
  const { cardId } = req.params;
  const comments = await commentService.getCommentsByCardId(cardId);
  res.status(200).json(ListCommentResponseSchema.parse(comments));
});

commentRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const data = UpdateCommentRequestSchema.parse(req.body);
  const updatedComment = await commentService.updateComment(id, data as any);
  res.status(200).json(CommentResponseSchema.parse(updatedComment));
});

commentRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await commentService.deleteComment(id);
  res.status(204).send();
});

export default commentRouter;