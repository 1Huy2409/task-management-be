import { AuthorizationHelper } from "../utils/authorizationHelper";
import { CardRepository } from "@/apis/card/repositories/card.repository";
import { Card } from "@/common/entities/card.entity";
import { NextFunction, Request, Response } from "express";
import { AuthFailureError, BadRequestError, ForbiddenError } from "../handler/error.response";
import { PermissionKey } from "../constants/permissions";
import { ListRepository } from "@/apis/list/repositories/list.repository";
import { AppDataSource } from "@/config/db.config";
import { List } from "../entities/list.entity";
import { ChecklistRepository } from "@/apis/checklist/repositories/checklist.repository";
import { Checklist } from "@/common/entities/checklist.entity";
import { ChecklistItemRepository } from "@/apis/checklist/repositories/checklist-item.repository";
import { ChecklistItem } from "@/common/entities/checklist-item.entity";

const authorizationHelper = new AuthorizationHelper();
const listRepository = new ListRepository(AppDataSource.getRepository(List));
const cardRepository = new CardRepository(AppDataSource.getRepository(Card));
const checklistRepository = new ChecklistRepository(AppDataSource.getRepository(Checklist));
const checklistItemRepository = new ChecklistItemRepository(AppDataSource.getRepository(ChecklistItem));

export const checkWorkspacePermission = (requiredPermission: PermissionKey) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const workspaceId = req.params.workspaceId || req.params.id || req.body.workspaceId;
            if (!workspaceId) {
                throw new BadRequestError('Workspace ID is required');
            }
            const hasPermission = await authorizationHelper.canAccessWorkspace(
                userId,
                workspaceId,
                requiredPermission
            )
            if (!hasPermission) {
                throw new ForbiddenError('You do not have permission to access this workspace');
            }
            next();
        }
        catch (error) {
            next(error)
        }
    }
}
export const checkBoardPermission = (requiredPermission: PermissionKey) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const boardId = req.params.boardId || req.params.id || req.body.boardId;
            console.log("Checking board permission for boardId:", boardId);
            if (!boardId) {
                throw new BadRequestError('Board ID is required');
            }
            const hasPermission = await authorizationHelper.canAccessBoard(
                userId,
                boardId,
                requiredPermission
            )
            if (!hasPermission) {
                throw new ForbiddenError('You do not have permission to access this board');
            }
            next();
        }
        catch (error) {
            console.error('Error in checkBoardPermission middleware:', error);
            next(error)
        }
    }
}
export const checkListPermission = (requiredPermission: PermissionKey) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const listId = req.params.listId || req.params.id || req.body.listId || req.query.listId as string;
            if (!listId) {
                throw new BadRequestError('List ID is required');
            }
            const list = await listRepository.findFullListById(listId);
            if (!list) {
                throw new BadRequestError(`List with ID ${listId} not found`);
            }
            const boardId = list.boardId;
            const hasPermission = await authorizationHelper.canAccessBoard(
                userId,
                boardId,
                requiredPermission
            )
            if (!hasPermission) {
                throw new ForbiddenError('You do not have permission to access this board');
            }
            next();
        }
        catch (error) {
            console.error('Error in checkListPermission middleware:', error);
            next(error)
        }
    }
}
export const checkCrossListPermission = (
    sourcePermission: PermissionKey,
    targetPermission: PermissionKey
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const { listId, targetBoardId } = req.body;
            if (!listId) {
                throw new BadRequestError('Source List ID is required');
            }
            if (!targetBoardId) {
                throw new BadRequestError('Target Board ID is required');
            }
            const list = await listRepository.findFullListById(listId);
            if (!list) {
                throw new BadRequestError(`List with ID ${listId} not found`);
            }
            const sourceBoardId = list.boardId;
            const hasSourcePermission = await authorizationHelper.canAccessBoard(
                userId,
                sourceBoardId,
                sourcePermission
            )
            if (!hasSourcePermission) {
                throw new ForbiddenError('You do not have permission to access the source board');
            }
            const hasTargetPermission = await authorizationHelper.canAccessBoard(
                userId,
                targetBoardId,
                targetPermission
            )
            if (!hasTargetPermission) {
                throw new ForbiddenError('You do not have permission to access the target board');
            }
            next();
        }
        catch (error) {
            console.error('Error in checkCrossListPermission middleware:', error);
            next(error)
        }
    }
}
export const checkCardPermission = (requiredPermission: PermissionKey) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const cardId = req.params.cardId || req.params.id || req.body.cardId;
            if (!cardId) {
                throw new BadRequestError('Card ID is required');
            }
            const card = await cardRepository.findByIdWithList(cardId);
            if (!card) {
                throw new BadRequestError(`Card with ID ${cardId} not found`);
            }
            if (!card.list) {
                throw new Error(`Card with ID ${cardId} belongs to no list`);
            }
            const boardId = card.list.boardId;
            const hasPermission = await authorizationHelper.canAccessBoard(
                userId,
                boardId,
                requiredPermission
            )
            if (!hasPermission) {
                throw new ForbiddenError('You do not have permission to access this board');
            }
            next();
        }
        catch (error) {
            console.error('Error in checkCardPermission middleware:', error);
            next(error)
        }
    }
}

export const checkChecklistPermission = (requiredPermission: PermissionKey) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) throw new AuthFailureError('User not authenticated', 401);

            const checklistId = req.params.checklistId || req.params.id || req.body.checklistId;
            if (!checklistId) throw new BadRequestError('Checklist ID is required');

            const checklist = await checklistRepository.findById(checklistId);
            if (!checklist) throw new BadRequestError(`Checklist with ID ${checklistId} not found`);

            // Navigate up to Board: Checklist -> Card -> List -> Board
            if (!checklist.card || !checklist.card.list) {
                throw new Error(`Checklist with ID ${checklistId} does not have valid hierarchy`);
            }

            const boardId = checklist.card.list.boardId;
            const hasPermission = await authorizationHelper.canAccessBoard(userId, boardId, requiredPermission);
            if (!hasPermission) throw new ForbiddenError('You do not have permission to access this board');
            next();
        } catch (error) {
            console.error('Error in checkChecklistPermission middleware:', error);
            next(error);
        }
    }
}

export const checkChecklistItemPermission = (requiredPermission: PermissionKey) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) throw new AuthFailureError('User not authenticated', 401);

            const itemId = req.params.itemId || req.params.id || req.body.itemId;
            if (!itemId) throw new BadRequestError('Checklist Item ID is required');

            const item = await checklistItemRepository.findById(itemId);
            if (!item) throw new BadRequestError(`Checklist Item with ID ${itemId} not found`);

            // Navigate up to Board: Item -> Checklist -> Card -> List -> Board
            if (!item.checklist || !item.checklist.card || !item.checklist.card.list) {
                throw new Error(`Checklist Item with ID ${itemId} does not have valid hierarchy`);
            }

            const boardId = item.checklist.card.list.boardId;
            const hasPermission = await authorizationHelper.canAccessBoard(userId, boardId, requiredPermission);
            if (!hasPermission) throw new ForbiddenError('You do not have permission to access this board');
            next();
        } catch (error) {
            console.error('Error in checkChecklistItemPermission middleware:', error);
            next(error);
        }
    }
}