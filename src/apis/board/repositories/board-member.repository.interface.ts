import { BoardMember } from "@/common/entities/board-member.entity";

export interface IBoardMemberRepository {
    findById(id: string): Promise<BoardMember | null>;
    findByBoardAndUserId(boardId: string, userId: string): Promise<BoardMember | null>;
    findByBoardId(boardId: string): Promise<BoardMember[]>;
    create(data: Partial<BoardMember>): Promise<BoardMember>;
    save(member: BoardMember): Promise<BoardMember>;
    update(id: string, member: Partial<BoardMember>): Promise<void>;
    delete(id: string): Promise<void>;
}
