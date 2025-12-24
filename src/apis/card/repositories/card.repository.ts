import { EntityManager, Repository } from "typeorm";
import { ICardRepository } from "./card.repository.interface";
import { Card } from "@/common/entities/card.entity";

export class CardRepository implements ICardRepository {
    constructor(private cardRepository: Repository<Card>) { }

    async create(data: Partial<Card>, manager?: EntityManager): Promise<Card> {
        const repo = manager ? manager.getRepository(Card) : this.cardRepository;
        const card = repo.create(data);
        return await repo.save(card);
    }

    async findById(id: string): Promise<Card | null> {
        return await this.cardRepository.findOne({ where: { id } });
    }

    async findByIdWithList(id: string): Promise<Card | null> {
        return await this.cardRepository.findOne({
            where: { id },
            relations: ['list']
        });
    }

    async findAll(): Promise<Card[]> {
        return await this.cardRepository.find();
    }

    async findByListId(listId: string): Promise<Card[]> {
        return await this.cardRepository.find({
            where: { listId },
            order: { position: 'ASC' }
        });
    }

    async update(id: string, data: Partial<Card>): Promise<Card | null> {
        await this.cardRepository.update(id, data);
        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.cardRepository.delete(id);
        return result.affected !== 0;
    }

    async save(card: Card): Promise<Card> {
        return await this.cardRepository.save(card);
    }
}