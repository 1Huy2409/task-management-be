import { Router } from 'express';
import multer from 'multer';
import { AttachmentController } from './attachment.controller';
import { AttachmentService } from './attachment.service';
import { AttachmentRepository } from './repositories/attachment.repository';
import { AppDataSource } from '@/config/db.config';
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { z } from "zod";

const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads
const attachmentRouter: Router = Router();

const attachmentRepository = new AttachmentRepository(AppDataSource);
const attachmentService = new AttachmentService(attachmentRepository);
const attachmentController = new AttachmentController(attachmentService);

attachmentRouter.post('/cards/:cardId/attachments',
  upload.single('file'),
  (req, res, next) => {
    const { cardId } = req.params;
    if (!cardId) {
      return res.status(400).json({ error: 'Missing cardId parameter' });
    }
    req.params = req.params as { cardId: string };
    next();
  },
  (req, res) => attachmentController.uploadAttachment(req, res)
);

attachmentRouter.delete('/attachments/:attachmentId',
  (req, res, next) => {
    const { attachmentId } = req.params;
    if (!attachmentId) {
      return res.status(400).json({ error: 'Missing attachmentId parameter' });
    }
    req.params = req.params as { attachmentId: string };
    next();
  },
  (req, res) => attachmentController.deleteAttachment(req, res)
);

export const attachmentRegistry = new OpenAPIRegistry();

attachmentRegistry.registerPath({
  method: "post",
  path: "/api/v1/cards/{cardId}/attachments",
  tags: ["Attachment"],
  request: {
    params: z.object({
      cardId: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.string().openapi({ example: "file.png" }),
          }),
        },
      },
    },
  },
  responses: createApiResponse(z.object({
    success: z.boolean(),
    message: z.string(),
  }), "Attachment uploaded successfully"),
});

attachmentRegistry.registerPath({
  method: "delete",
  path: "/api/v1/attachments/{attachmentId}",
  tags: ["Attachment"],
  request: {
    params: z.object({
      attachmentId: z.string().uuid().openapi({ example: "123e4567-e89b-12d3-a456-426614174000" }),
    }),
  },
  responses: {
    204: {
      description: "Attachment deleted successfully",
    },
  },
});

export default attachmentRouter;