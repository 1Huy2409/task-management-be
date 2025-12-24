import { ChecklistItem } from "@/common/entities/checklist-item.entity";

export interface IChecklistItemRepository {
    create(data: Partial<ChecklistItem>): Promise<ChecklistItem>;
    update(id: string, data: Partial<ChecklistItem>): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<ChecklistItem | null>;
    findByChecklistId(checklistId: string): Promise<ChecklistItem[]>;
}
