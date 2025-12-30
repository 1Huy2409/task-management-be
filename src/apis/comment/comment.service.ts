import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(data: CreateCommentDto) {
    return this.commentRepository.createComment(data);
  }

  async getCommentsByCardId(cardId: string) {
    return this.commentRepository.findCommentsByCardId(cardId);
  }

  async updateComment(id: string, data: UpdateCommentDto) {
    return this.commentRepository.updateComment(id, data);
  }

  async deleteComment(id: string) {
    return this.commentRepository.deleteComment(id);
  }
}