import { Card } from "@/common/entities/card.entity";
import { EntityManager } from "typeorm";

export interface ICardRepository {
    create(data: Partial<Card>, manager?: EntityManager): Promise<Card>;
    findById(id: string): Promise<Card | null>;
    findByIdWithList(id: string): Promise<Card | null>;
    findAll(): Promise<Card[]>;
    findByListId(listId: string): Promise<Card[]>;
    update(id: string, data: Partial<Card>): Promise<Card | null>;
    delete(id: string): Promise<boolean>;
    save(card: Card): Promise<Card>;
}