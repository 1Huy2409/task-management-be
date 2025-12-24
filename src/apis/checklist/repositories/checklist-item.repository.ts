import { Repository } from "typeorm";
import { IChecklistItemRepository } from "./checklist-item.repository.interface";
import { ChecklistItem } from "@/common/entities/checklist-item.entity";

export class ChecklistItemRepository implements IChecklistItemRepository {
    constructor(private checklistItemRepository: Repository<ChecklistItem>) { }

    async create(data: Partial<ChecklistItem>): Promise<ChecklistItem> {
        const item = this.checklistItemRepository.create(data);
        return await this.checklistItemRepository.save(item);
    }

    async update(id: string, data: Partial<ChecklistItem>): Promise<void> {
        await this.checklistItemRepository.update(id, data);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.checklistItemRepository.delete(id);
        return result.affected !== 0;
    }

    async findById(id: string): Promise<ChecklistItem | null> {
        return await this.checklistItemRepository.findOne({
            where: { id },
            relations: ['checklist', 'checklist.card', 'checklist.card.list'] // Need hierarchy for permission
        });
    }

    async findByChecklistId(checklistId: string): Promise<ChecklistItem[]> {
        return await this.checklistItemRepository.find({
            where: { checklistId },
            order: { position: 'ASC' }
        });
    }
}
