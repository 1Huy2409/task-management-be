import { Repository } from "typeorm";
import { ICardMemberRepository } from "./card-member.repository.interface";
import { CardMember } from "@/common/entities/card-member.entity";

export class CardMemberRepository implements ICardMemberRepository {
    constructor(private cardMemberRepository: Repository<CardMember>) { }

    async create(data: Partial<CardMember>): Promise<CardMember> {
        const member = this.cardMemberRepository.create(data);
        return await this.cardMemberRepository.save(member);
    }

    async findByCardAndUserId(cardId: string, userId: string): Promise<CardMember | null> {
        return await this.cardMemberRepository.findOne({
            where: {
                card: { id: cardId },
                user: { id: userId }
            },
            relations: ['user']
        });
    }

    async findByCardId(cardId: string): Promise<CardMember[]> {
        return await this.cardMemberRepository.find({
            where: { card: { id: cardId } },
            relations: ['user']
        });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.cardMemberRepository.delete(id);
        return result.affected !== 0;
    }
}
