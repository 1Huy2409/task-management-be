import { Repository } from "typeorm";
import { IBoardRepository } from "./board.repository.interface";
import { Board, BoardVisibility, BoardStatus } from "@/common/entities/board.entity";
import { NotFoundError } from "@/common/handler/error.response";
export class BoardRepository implements IBoardRepository {
    constructor(private boardRepository: Repository<Board>) { }

    async findById(id: string): Promise<Board | null> {
        return await this.boardRepository.findOne({ where: { id } });
    }

    async findByIdWithWorkspace(id: string): Promise<Board | null> {
        return await this.boardRepository.findOne({
            where: { id },
            relations: ['workspace']
        });
    }

    async findAll(): Promise<Board[]> {
        return await this.boardRepository.find();
    }

    async findPublicBoards(): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { visibility: BoardVisibility.PUBLIC, status: BoardStatus.ACTIVE }
        });
    }

    async findTemplates(): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { isTemplate: true, status: BoardStatus.ACTIVE }
        });
    }

    async findPublicBoardById(id: string): Promise<Board | null> {
        return await this.boardRepository.findOne({
            where: { id, visibility: BoardVisibility.PUBLIC, status: BoardStatus.ACTIVE }
        });
    }

    async findBoardsByWorkspaceId(workspaceId: string, userId: string): Promise<Board[]> {
        return await this.boardRepository.createQueryBuilder('board')
            .leftJoin('board.boardMembers', 'member')
            .where('board.workspaceId = :workspaceId', { workspaceId })
            .andWhere('board.status = :status', { status: BoardStatus.ACTIVE })
            .andWhere(
                '(board.visibility = :public OR board.visibility = :workspace OR (board.visibility = :private AND (board.ownerId = :userId OR member.userId = :userId)))',
                {
                    public: BoardVisibility.PUBLIC,
                    workspace: BoardVisibility.WORKSPACE,
                    private: BoardVisibility.PRIVATE,
                    userId
                }
            )
            .getMany();
    }

    async findBoardByWorkspaceId(id: string, workspaceId: string): Promise<Board | null> {
        return await this.boardRepository.findOne({
            where: { id, workspaceId: workspaceId, status: BoardStatus.ACTIVE }
        });
    }
    async findByTitleAndWorkspaceId(title: string, workspaceId: string): Promise<Board | null> {
        return await this.boardRepository.findOne({
            where: { title, workspaceId: workspaceId, status: BoardStatus.ACTIVE }
        });
    }

    async create(data: Partial<Board>): Promise<Board> {
        const board = this.boardRepository.create(data);
        return await this.boardRepository.save(board);
    }

    async update(id: string, board: Partial<Board>): Promise<Board> {
        await this.boardRepository.update(id, board);
        return await this.findById(id) as Board;
    }

    async save(board: Board): Promise<Board> {
        return await this.boardRepository.save(board);
    }

    async delete(id: string): Promise<any> {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        board.status = BoardStatus.ARCHIVED;
        await this.boardRepository.save(board);
        return {
            message: 'Board deleted successfully'
        }
    }

    async reopen(id: string): Promise<any> {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        board.status = BoardStatus.ACTIVE;
        await this.boardRepository.save(board);
        return {
            message: 'Board reopened successfully'
        }
    }

    async deletePermanent(id: string): Promise<any> {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        await this.boardRepository.delete(id);
        return {
            message: 'Board permanently deleted'
        }
    }

    async changeOwner(id: string, ownerId: string): Promise<Board> {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        board.ownerId = ownerId;
        return await this.boardRepository.save(board);
    }
}