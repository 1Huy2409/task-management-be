import { Repository } from "typeorm";
import { IBoardMemberRepository } from "./board-member.repository.interface";
import { BoardMember } from "@/common/entities/board-member.entity";

export class BoardMemberRepository implements IBoardMemberRepository {
    constructor(
        private readonly boardMemberRepository: Repository<BoardMember>
    ) { }

    async findById(id: string): Promise<BoardMember | null> {
        return this.boardMemberRepository.findOne({
            where: { id },
            relations: ['user', 'board', 'role']
        });
    }

    async findByBoardAndUserId(boardId: string, userId: string): Promise<BoardMember | null> {
        return this.boardMemberRepository.findOne({
            where: { boardId, userId },
            relations: ['user', 'board', 'role']
        });
    }

    async findByBoardId(boardId: string): Promise<BoardMember[]> {
        return this.boardMemberRepository.find({
            where: { boardId },
            relations: ['user', 'role']
        });
    }

    async create(data: Partial<BoardMember>): Promise<BoardMember> {
        const member = this.boardMemberRepository.create(data);
        return this.boardMemberRepository.save(member);
    }

    async save(member: BoardMember): Promise<BoardMember> {
        return this.boardMemberRepository.save(member);
    }

    async update(id: string, member: Partial<BoardMember>): Promise<void> {
        await this.boardMemberRepository.update(id, member);
    }

    async delete(id: string): Promise<void> {
        await this.boardMemberRepository.delete(id);
    }
}
