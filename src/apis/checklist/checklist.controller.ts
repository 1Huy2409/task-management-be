import { Request, Response } from "express";
import ChecklistService from "./checklist.service";
import { CreateChecklistSchema, CreateChecklistItemSchema, UpdateChecklistItemSchema } from "./schemas/checklist.request.schema";
import { BadRequestError } from "@/common/handler/error.response";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "@/common/utils/httpHandler";

export default class ChecklistController {
    constructor(private checklistService: ChecklistService) { }

    createChecklist = async (req: Request, res: Response) => {
        const validation = CreateChecklistSchema.safeParse(req.body);
        if (!validation.success) {
            throw new BadRequestError('Invalid checklist data: ' + validation.error.message);
        }
        const checklist = await this.checklistService.createChecklist(validation.data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Create checklist successfully',
            checklist,
            StatusCodes.CREATED
        );
        return handleServiceResponse(serviceResponse, res);
    }

    deleteChecklist = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError('Checklist ID is required');

        await this.checklistService.deleteChecklist(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Delete checklist successfully',
            null,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    createItem = async (req: Request, res: Response) => {
        // Assume checklistId is passed in body as per schema, BUT typically REST uses params.
        // User request: "Thêm một mục (item) vào checklist."
        // I'll support URL param :id as checklistId to override/supplement body.
        const checklistId = req.params.id;
        const body = { ...req.body, checklistId: checklistId || req.body.checklistId };

        const validation = CreateChecklistItemSchema.safeParse(body);
        if (!validation.success) {
            throw new BadRequestError('Invalid item data: ' + validation.error.message);
        }
        const item = await this.checklistService.createItem(validation.data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Create item successfully',
            item,
            StatusCodes.CREATED
        );
        return handleServiceResponse(serviceResponse, res);
    }

    updateItem = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError('Item ID is required');

        const validation = UpdateChecklistItemSchema.safeParse(req.body);
        if (!validation.success) {
            throw new BadRequestError('Invalid update data: ' + validation.error.message);
        }

        const item = await this.checklistService.updateItem(id, validation.data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Update item successfully',
            item,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    deleteItem = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new BadRequestError('Item ID is required');

        await this.checklistService.deleteItem(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Delete item successfully',
            null,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }
}
