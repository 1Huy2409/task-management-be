import { Repository } from "typeorm";
import { IChecklistRepository } from "./checklist.repository.interface";
import { Checklist } from "@/common/entities/checklist.entity";

export class ChecklistRepository implements IChecklistRepository {
    constructor(private checklistRepository: Repository<Checklist>) { }

    async create(data: Partial<Checklist>): Promise<Checklist> {
        const checklist = this.checklistRepository.create(data);
        return await this.checklistRepository.save(checklist);
    }

    async update(id: string, data: Partial<Checklist>): Promise<void> {
        await this.checklistRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.checklistRepository.delete(id);
        return result.affected !== 0;
    }

    async findById(id: string): Promise<Checklist | null> {
        return await this.checklistRepository.findOne({
            where: { id },
            relations: ['items', 'card', 'card.list'] // Need card.list for permission check
        });
    }

    async findByCardId(cardId: string): Promise<Checklist[]> {
        return await this.checklistRepository.find({
            where: { cardId },
            relations: ['items'],
            order: { created_at: 'ASC' }
        });
    }
}
