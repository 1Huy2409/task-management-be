import { Router } from "express";
import CardController from "./card.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { checkAuthentication } from "@/common/middleware/authentication";
import { PERMISSIONS } from "@/common/constants/permissions";
import { checkCardPermission, checkListPermission } from "@/common/middleware/authorization";

export default function cardRouter(cardController: CardController): Router {
    const router = Router();

    router.post('/',
        asyncHandler(checkAuthentication),
        asyncHandler(checkListPermission(PERMISSIONS.CARD_CREATE)),
        asyncHandler(cardController.createCard)
    );

    router.get('/',
        asyncHandler(checkAuthentication),
        asyncHandler(checkListPermission(PERMISSIONS.CARD_VIEW)),
        asyncHandler(cardController.getAllCards)
    );

    router.get('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_VIEW)),
        asyncHandler(cardController.getCardById)
    );

    router.patch('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_UPDATE)),
        asyncHandler(cardController.updateCard)
    );

    router.delete('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_DELETE)),
        asyncHandler(cardController.deleteCard)
    );

    return router;
}
