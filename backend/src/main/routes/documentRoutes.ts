import { Router } from "express";
import userVerification from "../../infrastructure/middleware/AuthMiddleware";
import * as ctrl from "../../infrastructure/controllers/documentController";
import { authorizeDocAccess } from "../../infrastructure/middleware/PermissionsMiddleware";

const router = Router();

router.use(userVerification);   

router
  .post("/",                                         ctrl.createDocument)
  .get("/",                                          ctrl.listDocuments)
  .get("/:id",         authorizeDocAccess('viewer'), ctrl.getDocument)
  .patch("/:id",       authorizeDocAccess('editor'), ctrl.updateDocument)
  .delete("/:id",      authorizeDocAccess('editor'), ctrl.archiveDocument)
  .post("/:id/share",  authorizeDocAccess('owner'),  ctrl.shareDocument);

export default router;
