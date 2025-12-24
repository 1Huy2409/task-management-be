import { Card } from "@/common/entities/card.entity";
import { CardResponseSchema } from "../schemas/card.response.schema";

export const toCardResponse = (card: Card): CardResponseSchema => {
    return {
        id: card.id,
        title: card.title,
        description: card.description || null,
        position: parseFloat(card.position.toString()), // Ensure it's a number
        priority: card.priority as 'low' | 'medium' | 'high',
        dueDate: card.dueDate ? card.dueDate.toISOString() : null,
        coverUrl: card.coverUrl || null,
        listId: card.listId,
        createdAt: card.created_at,
        updatedAt: card.updated_at
    };
}
