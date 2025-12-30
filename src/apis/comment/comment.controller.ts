import { Router, Request, Response } from 'express';
import { CommentService } from './comment.service';
import { CommentRepository } from './repositories/comment.repository';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { AppDataSource } from '@/config/db.config';

const commentRouter: Router = Router();
const commentRepository = new CommentRepository(AppDataSource);
const commentService = new CommentService(commentRepository);

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  async createComment(req: Request<{}, {}, CreateCommentDto>, res: Response) {
    const data = req.body;
    const comment = await this.commentService.createComment(data);
    res.status(201).json(comment);
  }

  async getCommentsByCardId(req: Request<{ cardId: string }>, res: Response) {
    const { cardId } = req.params;
    const comments = await this.commentService.getCommentsByCardId(cardId);
    res.status(200).json(comments);
  }

  async updateComment(req: Request<{ id: string }, {}, UpdateCommentDto>, res: Response) {
    const { id } = req.params;
    const data = req.body;
    const updatedComment = await this.commentService.updateComment(id, data);
    res.status(200).json(updatedComment);
  }

  async deleteComment(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;
    await this.commentService.deleteComment(id);
    res.status(204).send();
  }
}

commentRouter.post('/', async (req, res) => {
  const data: CreateCommentDto = req.body;
  const comment = await commentService.createComment(data);
  res.status(201).json(comment);
});

commentRouter.get('/card/:cardId', async (req, res) => {
  const { cardId } = req.params;
  const comments = await commentService.getCommentsByCardId(cardId);
  res.status(200).json(comments);
});

commentRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const data: UpdateCommentDto = req.body;
  const updatedComment = await commentService.updateComment(id, data);
  res.status(200).json(updatedComment);
});

commentRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await commentService.deleteComment(id);
  res.status(204).send();
});

export default commentRouter;