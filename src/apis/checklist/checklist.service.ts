import { NotFoundError } from "@/common/handler/error.response";
import { IChecklistRepository } from "./repositories/checklist.repository.interface";
import { IChecklistItemRepository } from "./repositories/checklist-item.repository.interface";
import { CreateChecklistItemSchema, CreateChecklistSchema, UpdateChecklistItemSchema, UpdateChecklistSchema } from "./schemas/checklist.request.schema";
import { ChecklistResponseSchema, ChecklistItemResponseSchema } from "./schemas/checklist.response.schema";
import { ICardRepository } from "../card/repositories/card.repository.interface"; // Need to verify card exists
import { POSITION_INCREMENT } from "@/common/utils/positionCalculator";

export default class ChecklistService {
    constructor(
        private checklistRepository: IChecklistRepository,
        private checklistItemRepository: IChecklistItemRepository,
        private cardRepository: ICardRepository
    ) { }

    private toChecklistItemResponse(item: any): ChecklistItemResponseSchema {
        return {
            id: item.id,
            title: item.title,
            isChecked: item.isChecked,
            checklistId: item.checklistId,
            position: item.position,
            createdAt: item.created_at,
            updatedAt: item.updated_at
        };
    }

    private toChecklistResponse(checklist: any): ChecklistResponseSchema {
        return {
            id: checklist.id,
            title: checklist.title,
            cardId: checklist.cardId,
            items: checklist.items ? checklist.items.map(this.toChecklistItemResponse) : [],
            createdAt: checklist.created_at,
            updatedAt: checklist.updated_at
        };
    }

    createChecklist = async (data: CreateChecklistSchema): Promise<ChecklistResponseSchema> => {
        const card = await this.cardRepository.findById(data.cardId);
        if (!card) {
            throw new NotFoundError(`Card with ID ${data.cardId} not found`);
        }

        const checklist = await this.checklistRepository.create({
            title: data.title,
            cardId: data.cardId
        });

        // Fetch again to ensure relations if needed, though create typically returns what's saved.
        // For checklist, we just need basic fields.
        return this.toChecklistResponse(checklist);
    }

    deleteChecklist = async (id: string): Promise<void> => {
        const deleted = await this.checklistRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Checklist with ID ${id} not found`);
        }
    }

    createItem = async (data: CreateChecklistItemSchema): Promise<ChecklistItemResponseSchema> => {
        const checklist = await this.checklistRepository.findById(data.checklistId);
        if (!checklist) {
            throw new NotFoundError(`Checklist with ID ${data.checklistId} not found`);
        }

        const items = await this.checklistItemRepository.findByChecklistId(data.checklistId);
        let position = POSITION_INCREMENT;
        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            if (lastItem) {
                position = lastItem.position + POSITION_INCREMENT;
            }
        }

        const item = await this.checklistItemRepository.create({
            title: data.title,
            checklistId: data.checklistId,
            position: position,
            isChecked: false
        });

        return this.toChecklistItemResponse(item);
    }

    updateItem = async (id: string, data: UpdateChecklistItemSchema): Promise<ChecklistItemResponseSchema> => {
        const item = await this.checklistItemRepository.findById(id);
        if (!item) {
            throw new NotFoundError(`Checklist Item with ID ${id} not found`);
        }

        const updatePayload: any = { ...data };
        Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

        await this.checklistItemRepository.update(id, updatePayload);
        const updatedItem = await this.checklistItemRepository.findById(id);
        if (!updatedItem) throw new NotFoundError('Item not found after update');

        return this.toChecklistItemResponse(updatedItem);
    }

    deleteItem = async (id: string): Promise<void> => {
        const deleted = await this.checklistItemRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Checklist Item with ID ${id} not found`);
        }
    }
}
