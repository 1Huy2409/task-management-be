import { Router } from "express";
import CardController from "./card.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { checkAuthentication } from "@/common/middleware/authentication";
import { PERMISSIONS } from "@/common/constants/permissions";
import { checkCardPermission, checkListPermission } from "@/common/middleware/authorization";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

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

    router.post('/:id/members',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_ASSIGN)),
        asyncHandler(cardController.assignMember)
    );

    router.delete('/:id/members/:userId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_ASSIGN)),
        asyncHandler(cardController.removeMember)
    );

    router.post('/:cardId/attachments',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_UPDATE)),
        upload.single('file'),
        asyncHandler((req, res) => {
            if (!req.params.cardId) {
                return res.status(400).json({ error: 'Missing or invalid cardId parameter' });
            }
            cardController.uploadAttachment(req, res);
        })
    );

    router.delete('/attachments/:attachmentId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkCardPermission(PERMISSIONS.CARD_UPDATE)),
        asyncHandler((req, res) => {
            if (!req.params.attachmentId) {
                return res.status(400).json({ error: 'Missing or invalid attachmentId parameter' });
            }
            cardController.deleteAttachment(req, res);
        })
    );

    return router;
}
