import { BoardTemplate } from "@/common/entities/board-template.entity";

export interface IBoardTemplateRepository {
    findAll(): Promise<BoardTemplate[]>;
    findById(id: string): Promise<BoardTemplate | null>;
    findByIdWithLists(id: string): Promise<BoardTemplate | null>;
}
