import { Repository } from "typeorm";
import { BoardTemplate } from "@/common/entities/board-template.entity";
import { IBoardTemplateRepository } from "./board-template.repository.interface";

export class BoardTemplateRepository implements IBoardTemplateRepository {
    constructor(private repository: Repository<BoardTemplate>) { }

    async findAll(): Promise<BoardTemplate[]> {
        return await this.repository.find();
    }

    async findById(id: string): Promise<BoardTemplate | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByIdWithLists(id: string): Promise<BoardTemplate | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ['lists'],
            order: {
                lists: {
                    position: 'ASC'
                }
            }
        });
    }
}
