import { IBaseRepository } from "@/common/repositories/base.repository.interface";
import { Board } from "@/common/entities/board.entity";
export interface IBoardRepository extends IBaseRepository<Board> {
    findByIdWithWorkspace(id: string): Promise<Board | null>;
    findPublicBoards(): Promise<Board[]>;
    findTemplates(): Promise<Board[]>;
    findPublicBoardById(id: string): Promise<Board | null>;
    findBoardsByWorkspaceId(workspaceId: string, userId: string): Promise<Board[]>;
    findBoardByWorkspaceId(id: string, workspaceId: string): Promise<Board | null>;
    findByTitleAndWorkspaceId(title: string, workspaceId: string): Promise<Board | null>;
    create(data: Partial<Board>): Promise<Board>;
    update(id: string, board: Partial<Board>): Promise<Board>;
    save(board: Board): Promise<Board>;
    delete(id: string): Promise<any>;
    reopen(id: string): Promise<any>;
    deletePermanent(id: string): Promise<any>;
    changeOwner(id: string, ownerId: string): Promise<Board>;
}