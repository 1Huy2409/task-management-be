import { NotFoundError } from "@/common/handler/error.response";
import { ICardRepository } from "./repositories/card.repository.interface";
import { CreateCardSchema, UpdateCardSchema } from "./schemas/card.request.schema";
import { CardResponseSchema } from "./schemas/card.response.schema";
import { toCardResponse } from "./mapper/card.mapper";
import { IListRepository } from "../list/repositories/list.repository.interface";
import { POSITION_INCREMENT } from "@/common/utils/positionCalculator";
import { DataSource } from "typeorm";
import { Card } from "@/common/entities/card.entity";

export default class CardService {
    constructor(
        private cardRepository: ICardRepository,
        private listRepository: IListRepository,
        private dataSource: DataSource
    ) { }

    getAll = async (listId: string): Promise<CardResponseSchema[]> => {
        const cards = await this.cardRepository.findByListId(listId);
        return cards.map(toCardResponse);
    }

    getCardById = async (id: string): Promise<CardResponseSchema> => {
        const card = await this.cardRepository.findById(id);
        if (!card) {
            throw new NotFoundError(`Card with ID ${id} not found`);
        }
        return toCardResponse(card);
    }

    createCard = async (data: CreateCardSchema): Promise<CardResponseSchema> => {
        const list = await this.listRepository.findById(data.listId);
        if (!list) {
            throw new NotFoundError(`List with ID ${data.listId} not found`);
        }

        // Calculate position: append to end of list
        const cards = await this.cardRepository.findByListId(data.listId);
        let position = POSITION_INCREMENT;
        if (cards.length > 0) {
            const lastCard = cards[cards.length - 1]; // Safe access checked by length
            if (lastCard) {
                position = Number(lastCard.position) + POSITION_INCREMENT;
            }
        }

        const cardPayload: any = {
            title: data.title,
            listId: data.listId,
            description: data.description,
            priority: data.priority,
            coverUrl: data.coverUrl,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            position: position
        };
        Object.keys(cardPayload).forEach(key => cardPayload[key] === undefined && delete cardPayload[key]);

        const newCard = await this.cardRepository.create(cardPayload);
        return toCardResponse(newCard);
    }

    updateCard = async (id: string, data: UpdateCardSchema): Promise<CardResponseSchema> => {
        const card = await this.cardRepository.findById(id);
        if (!card) {
            throw new NotFoundError(`Card with ID ${id} not found`);
        }

        let newPosition = card.position;
        let newListId = card.listId;

        // If moving list (changing listId)
        if (data.listId && data.listId !== card.listId) {
            const list = await this.listRepository.findById(data.listId);
            if (!list) {
                throw new NotFoundError(`Target List with ID ${data.listId} not found`);
            }
            newListId = data.listId;
            // For simplicity in updateCard, if listId changes but position is not provided, append to end
            if (data.position === undefined) {
                const cards = await this.cardRepository.findByListId(data.listId);
                let position = POSITION_INCREMENT;
                if (cards.length > 0) {
                    const lastCard = cards[cards.length - 1];
                    if (lastCard) {
                        position = Number(lastCard.position) + POSITION_INCREMENT;
                    }
                }
                newPosition = position;
            }
        }

        if (data.position !== undefined) {
            newPosition = data.position;
        }

        const updatePayload: any = {
            title: data.title,
            description: data.description,
            priority: data.priority,
            coverUrl: data.coverUrl,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            listId: newListId !== card.listId ? newListId : undefined,
            position: newPosition !== card.position ? newPosition : undefined
        };

        Object.keys(updatePayload).forEach(key => updatePayload[key] === undefined && delete updatePayload[key]);

        await this.cardRepository.update(id, updatePayload);
        const updatedCard = await this.cardRepository.findById(id);
        if (!updatedCard) throw new NotFoundError('Card not found after update');

        return toCardResponse(updatedCard);
    }

    deleteCard = async (id: string): Promise<void> => {
        const deleted = await this.cardRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Card with ID ${id} not found`);
        }
    }
}
