import { DataSource } from 'typeorm';
import { Comment } from 'src/common/entities/comment.entity';
import { CreateCommentDto } from '../dto/comment.dto';

export class CommentRepository {
  constructor(private readonly dataSource: DataSource) {}

  async createComment(data: CreateCommentDto): Promise<Comment> {
    const comment = this.dataSource.getRepository(Comment).create(data);
    return this.dataSource.getRepository(Comment).save(comment);
  }

  async findCommentsByCardId(cardId: string): Promise<Comment[]> {
    return this.dataSource.getRepository(Comment).find({ where: { cardId } as any });
  }

  async updateComment(id: string, data: Partial<CreateCommentDto>): Promise<Comment> {
    await this.dataSource.getRepository(Comment).update(id, data);
    const comment = await this.dataSource.getRepository(Comment).findOneBy({ id });
    if (!comment) {
      throw new Error(`Comment with id ${id} not found`);
    }
    return comment;
  }

  async deleteComment(id: string): Promise<void> {
    await this.dataSource.getRepository(Comment).delete(id);
  }
}