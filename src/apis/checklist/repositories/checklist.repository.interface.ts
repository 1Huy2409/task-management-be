import { Checklist } from "@/common/entities/checklist.entity";

export interface IChecklistRepository {
    create(data: Partial<Checklist>): Promise<Checklist>;
    update(id: string, data: Partial<Checklist>): Promise<void>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Checklist | null>;
    findByCardId(cardId: string): Promise<Checklist[]>;
}
