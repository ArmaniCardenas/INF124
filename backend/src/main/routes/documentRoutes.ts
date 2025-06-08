import { Router, RequestHandler } from "express";
import userVerification from "../../infrastructure/middleware/AuthMiddleware";
import * as ctrl from "../../infrastructure/controllers/documentController";

const router = Router();

router.use(userVerification);   

router
<<<<<<< Updated upstream
  .get("/trash", ctrl.listTrashDocuments)
=======
  .post("/",                                         ctrl.createDocument)
  .get("/",                                          ctrl.listDocuments)
  .get("/trash",                                     ctrl.listTrashDocuments)
  .get("/:id",         authorizeDocAccess('viewer'), ctrl.getDocument)
  .patch("/:id",       authorizeDocAccess('editor'), ctrl.updateDocument)
  .delete("/:id",      authorizeDocAccess('editor'), ctrl.deleteDocument)
  
  .patch("/:id/icon",   authorizeDocAccess('editor'), ctrl.updateIcon)
  .delete("/:id/icon",   authorizeDocAccess('editor'), ctrl.removeIcon)
  .post("/:id/share",  authorizeDocAccess('owner'),  ctrl.shareDocument)
>>>>>>> Stashed changes
  .patch("/:id/restore", ctrl.restoreDocument)

  .post("/",     ctrl.createDocument)
  .get("/",      ctrl.listDocuments)

  .patch("/:id/archive", ctrl.archiveDocument)
  .patch("/:id", ctrl.updateDocument)



  .get("/:id",   ctrl.getDocument)

  

  .delete("/:id",ctrl.deleteDocument);

export default router;
