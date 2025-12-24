import { describe, it, expect, vi, beforeEach } from 'vitest';
import CardService from './card.service';
import ChecklistService from '../checklist/checklist.service';

// Mock dependencies
const mockCardRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    findByIdWithList: vi.fn(),
    findAll: vi.fn(),
    findByListId: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    save: vi.fn(),
};

const mockListRepository = {
    findById: vi.fn(),
    findFullListById: vi.fn(),
    update: vi.fn(),
};

const mockCardMemberRepository = {
    create: vi.fn(),
    findByCardAndUserId: vi.fn(),
    findByCardId: vi.fn(),
    delete: vi.fn(),
};

const mockBoardMemberRepository = {
    findByBoardAndUserId: vi.fn(),
};

const mockChecklistRepository = {
    create: vi.fn(),
    findById: vi.fn(),
    delete: vi.fn(),
};

const mockChecklistItemRepository = {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByChecklistId: vi.fn(),
    findById: vi.fn(),
};

// Mock DataSource
const mockDataSource = {
    transaction: vi.fn((cb) => cb({
        getRepository: vi.fn()
    })),
} as any;

describe('Card Flow Verification', () => {
    let cardService: CardService;
    let checklistService: ChecklistService;

    beforeEach(() => {
        vi.clearAllMocks();
        cardService = new CardService(
            mockCardRepository as any,
            mockListRepository as any,
            mockCardMemberRepository as any,
            mockBoardMemberRepository as any,
            mockDataSource
        );
        checklistService = new ChecklistService(
            mockChecklistRepository as any,
            mockChecklistItemRepository as any,
            mockCardRepository as any
        );
    });

    describe('Card CRUD', () => {
        it('should create a card successfully', async () => {
            const listMock = { id: 'list-1', boardId: 'board-1', cards: [] };
            mockListRepository.findById.mockResolvedValue(listMock);
            mockCardRepository.findByListId.mockResolvedValue([]);
            mockCardRepository.create.mockResolvedValue({ id: 'card-1', title: 'New Card', position: 1000, listId: 'list-1' });
            mockCardRepository.save.mockResolvedValue({ id: 'card-1', title: 'New Card', position: 1000, listId: 'list-1' });

            const result = await cardService.createCard({ title: 'New Card', listId: 'list-1', priority: 'medium' });

            expect(mockListRepository.findById).toHaveBeenCalledWith('list-1');
            expect(mockCardRepository.create).toHaveBeenCalled();
            expect(result.id).toBe('card-1');
            expect(result.position).toBe(1000);
        });

        it('should update a card position (Reorder)', async () => {
            const cardMock = { id: 'card-1', listId: 'list-1', position: 1000 };
            mockCardRepository.findById.mockResolvedValue(cardMock);
            mockCardRepository.update.mockResolvedValue(undefined);
            mockCardRepository.findById.mockResolvedValueOnce(cardMock).mockResolvedValueOnce({ ...cardMock, position: 1500 });

            const result = await cardService.updateCard('card-1', { position: 1500 });

            expect(mockCardRepository.update).toHaveBeenCalledWith('card-1', { position: 1500 });
            expect(result.position).toBe(1500);
        });
    });

    describe('Card Members', () => {
        it('should assign a member to a card', async () => {
            const cardMock = { id: 'card-1', list: { boardId: 'board-1' } };
            mockCardRepository.findByIdWithList.mockResolvedValue(cardMock);
            mockCardMemberRepository.findByCardAndUserId.mockResolvedValue(null); // Not already member
            mockBoardMemberRepository.findByBoardAndUserId.mockResolvedValue({ id: 'bm-1' }); // Is board member
            mockCardMemberRepository.create.mockResolvedValue({ id: 'cm-1', cardId: 'card-1', userId: 'user-1' });

            await cardService.assignMember('card-1', 'user-1');

            expect(mockBoardMemberRepository.findByBoardAndUserId).toHaveBeenCalledWith('board-1', 'user-1');
            expect(mockCardMemberRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                card: cardMock,
                user: expect.objectContaining({ id: 'user-1' }),
                role: 1
            }));
        });

        it('should fail to assign if user not in board', async () => {
            const cardMock = { id: 'card-1', list: { boardId: 'board-1' } };
            mockCardRepository.findByIdWithList.mockResolvedValue(cardMock);
            mockCardMemberRepository.findByCardAndUserId.mockResolvedValue(null);
            mockBoardMemberRepository.findByBoardAndUserId.mockResolvedValue(null); // Not board member

            await expect(cardService.assignMember('card-1', 'user-1'))
                .rejects.toThrow('User is not a member of the board');
        });
    });

    describe('Checklist Flow', () => {
        it('should create a checklist', async () => {
            mockCardRepository.findById.mockResolvedValue({ id: 'card-1' });
            mockChecklistRepository.create.mockResolvedValue({ id: 'cl-1', title: 'ToDo', cardId: 'card-1' });

            const result = await checklistService.createChecklist({ title: 'ToDo', cardId: 'card-1' });

            expect(mockChecklistRepository.create).toHaveBeenCalledWith({ title: 'ToDo', cardId: 'card-1' });
            expect(result.id).toBe('cl-1');
        });

        it('should add an item to checklist with correct position', async () => {
            mockChecklistRepository.findById.mockResolvedValue({ id: 'cl-1' });
            mockChecklistItemRepository.findByChecklistId.mockResolvedValue([
                { id: 'item-1', position: 1000 }
            ]);
            mockChecklistItemRepository.create.mockResolvedValue({ id: 'item-2', title: 'New Item', position: 2000, checklistId: 'cl-1' });

            const result = await checklistService.createItem({ title: 'New Item', checklistId: 'cl-1' });

            expect(mockChecklistItemRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Item',
                checklistId: 'cl-1',
                position: 2000
            }));
            expect(result.position).toBe(2000);
        });

        it('should update item status', async () => {
            mockChecklistItemRepository.findById.mockResolvedValue({ id: 'item-1', isChecked: false });
            mockChecklistItemRepository.update.mockResolvedValue(undefined);
            mockChecklistItemRepository.findById.mockResolvedValueOnce({ id: 'item-1', isChecked: true });

            const result = await checklistService.updateItem('item-1', { isChecked: true });

            expect(mockChecklistItemRepository.update).toHaveBeenCalledWith('item-1', { isChecked: true });
        });
    });
});
