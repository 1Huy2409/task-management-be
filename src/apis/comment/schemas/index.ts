import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CommentResponseSchema = z.object({
  id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  content: z.string().openapi({ example: 'This is a comment' }),
  cardId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  userId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  createdAt: z.date().openapi({ example: new Date() }),
  updatedAt: z.date().openapi({ example: new Date() }),
});

export const ListCommentResponseSchema = z.array(CommentResponseSchema);

export const CreateCommentRequestSchema = z.object({
  content: z.string().min(1).openapi({ example: 'This is a new comment' }),
  cardId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  userId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
});

export const UpdateCommentRequestSchema = z.object({
  content: z.string().optional().openapi({ example: 'Updated comment content' }),
});