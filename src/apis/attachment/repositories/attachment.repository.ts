import { DataSource } from 'typeorm';
import { Attachment } from '@/common/entities/attachment.entity';

export class AttachmentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createAttachment(cardId: string, file: Express.Multer.File): Promise<Attachment> {
    const attachment = this.dataSource.getRepository(Attachment).create({
      cardId,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
    return this.dataSource.getRepository(Attachment).save(attachment);
  }

  async deleteAttachment(attachmentId: string): Promise<void> {
    await this.dataSource.getRepository(Attachment).delete(attachmentId);
  }
}