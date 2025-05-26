import { Router, RequestHandler } from "express";
import userVerification from "../../infrastructure/middleware/AuthMiddleware";
import * as ctrl from "../../infrastructure/controllers/documentController";

const router = Router();

router.use(userVerification);   

router
  .get("/trash", ctrl.listTrashDocuments)
  .patch("/:id/restore", ctrl.restoreDocument)

  .post("/",     ctrl.createDocument)
  .get("/",      ctrl.listDocuments)

  .patch("/:id/archive", ctrl.archiveDocument)
  .patch("/:id", ctrl.updateDocument)



  .get("/:id",   ctrl.getDocument)

  

  .delete("/:id",ctrl.deleteDocument);

export default router;
