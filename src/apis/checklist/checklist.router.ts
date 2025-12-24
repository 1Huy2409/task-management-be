import { Router } from "express";
import ChecklistController from "./checklist.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { checkAuthentication } from "@/common/middleware/authentication";
import { PERMISSIONS } from "@/common/constants/permissions";
import { checkCardPermission, checkChecklistPermission, checkChecklistItemPermission } from "@/common/middleware/authorization";

export default function checklistRouter(checklistController: ChecklistController): Router {
    const router = Router();

    // Create Checklist (Requires Card ID in body, check card permission)
    router.post('/',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_UPDATE)), // Assuming updating card includes adding checklist
        asyncHandler(checklistController.createChecklist)
    );

    router.delete('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkChecklistPermission(PERMISSIONS.CARD_UPDATE)),
        asyncHandler(checklistController.deleteChecklist)
    );

    // Items
    router.post('/:id/items',
        asyncHandler(checkAuthentication),
        asyncHandler(checkChecklistPermission(PERMISSIONS.CARD_UPDATE)),
        asyncHandler(checklistController.createItem)
    );

    // Note: Ideally routes should be hierarchical or distinct resource /checklist-items
    // But since router mounts at /checklists, I will mount item routes here too for simplicity, using distinct paths.
    // However, RESTfully, updating an item should probably be /checklist-items/:id.
    // For now, I will use /items/:id sub-route in this router.

    router.patch('/items/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkChecklistItemPermission(PERMISSIONS.CARD_UPDATE)),
        asyncHandler(checklistController.updateItem)
    );

    router.delete('/items/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkChecklistItemPermission(PERMISSIONS.CARD_UPDATE)),
        asyncHandler(checklistController.deleteItem)
    );

    return router;
}
