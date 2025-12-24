import { CardMember } from "@/common/entities/card-member.entity";

export interface ICardMemberRepository {
    create(data: Partial<CardMember>): Promise<CardMember>;
    findByCardAndUserId(cardId: string, userId: string): Promise<CardMember | null>;
    delete(id: string): Promise<boolean>;
    findByCardId(cardId: string): Promise<CardMember[]>;
}
