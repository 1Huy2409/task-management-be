import { AttachmentRepository } from './repositories/attachment.repository';

export class AttachmentService {
  constructor(private readonly attachmentRepository: AttachmentRepository) {}

  async uploadAttachment(cardId: string, file: Express.Multer.File) {
    // Save file metadata and associate it with the card
    return this.attachmentRepository.createAttachment(cardId, file);
  }

  async deleteAttachment(attachmentId: string) {
    // Delete the attachment record and the file from storage
    await this.attachmentRepository.deleteAttachment(attachmentId);
  }
}