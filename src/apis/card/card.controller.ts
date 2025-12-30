import { Request, Response } from "express";
import CardService from "./card.service";
import { CreateCardSchema, UpdateCardSchema } from "./schemas/card.request.schema";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { BadRequestError } from "@/common/handler/error.response";

export default class CardController {
    constructor(private cardService: CardService) { }

    createCard = async (req: Request, res: Response) => {
        const validation = CreateCardSchema.safeParse(req.body);
        if (!validation.success) {
            throw new BadRequestError('Invalid card data: ' + validation.error.message);
        }
        const data = validation.data;
        const card = await this.cardService.createCard(data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Create card successfully',
            card,
            StatusCodes.CREATED
        );
        return handleServiceResponse(serviceResponse, res);
    }

    getAllCards = async (req: Request, res: Response) => {
        // Assume get all cards in a list (listId query param or body)
        // But usually REST is /lists/:listId/cards or /cards?listId=...
        // For simplicity and matching my service which takes listId, I'll expect listId in query
        const listId = req.query.listId as string;
        if (!listId) {
            throw new BadRequestError('List ID is required as query parameter');
        }
        const cards = await this.cardService.getAll(listId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get all cards successfully',
            cards,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    getCardById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError('Card ID is required');

        const card = await this.cardService.getCardById(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get card by ID successfully',
            card,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    updateCard = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError('Card ID is required');

        const validation = UpdateCardSchema.safeParse(req.body);
        if (!validation.success) {
            throw new BadRequestError('Invalid update data: ' + validation.error.message);
        }

        const card = await this.cardService.updateCard(id, validation.data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Update card successfully',
            card,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    deleteCard = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError('Card ID is required');

        await this.cardService.deleteCard(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Delete card successfully',
            null,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    assignMember = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { userId } = req.body;
        if (!id) throw new BadRequestError('Card ID is required');
        if (!userId) throw new BadRequestError('User ID is required');

        await this.cardService.assignMember(id, userId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Assign member successfully',
            null,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    removeMember = async (req: Request, res: Response) => {
        const { id, userId } = req.params;
        if (!id) throw new BadRequestError('Card ID is required');
        if (!userId) throw new BadRequestError('User ID is required');

        await this.cardService.removeMember(id, userId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Remove member successfully',
            null,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    uploadAttachment = async (req: Request, res: Response) => {
        const { cardId } = req.params;
        if (!cardId) {
            throw new BadRequestError('Card ID is required');
        }

        const file = req.file;
        if (!file) {
            throw new BadRequestError('File is required');
        }

        const attachment = await this.cardService.uploadAttachment(cardId, file);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Attachment uploaded successfully',
            attachment,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    deleteAttachment = async (req: Request, res: Response) => {
        const { attachmentId } = req.params;
        if (!attachmentId) {
            throw new BadRequestError('Attachment ID is required');
        }

        await this.cardService.deleteAttachment(attachmentId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Attachment deleted successfully',
            null,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }
}
