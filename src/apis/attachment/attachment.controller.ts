import { Request, Response } from 'express';
import { AttachmentService } from './attachment.service';

export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  async uploadAttachment(req: Request, res: Response) {
    const { cardId } = req.params;
    if (!cardId || typeof cardId !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing cardId parameter' });
    }

    const file = req.file; // Assuming middleware like multer is used
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const attachment = await this.attachmentService.uploadAttachment(cardId, file);
    res.status(201).json(attachment);
  }

  async deleteAttachment(req: Request<{ attachmentId: string }>, res: Response) {
    const { attachmentId } = req.params;

    await this.attachmentService.deleteAttachment(attachmentId);
    res.status(204).send();
  }
}