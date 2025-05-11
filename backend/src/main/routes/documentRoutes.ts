import { Router } from "express";
import userVerification from "../../infrastructure/middleware/AuthMiddleware";
import * as ctrl from "../../infrastructure/controllers/documentController";

const router = Router();

router.use(userVerification);   

router
  .post("/",     ctrl.createDocument)
  .get("/",      ctrl.listDocuments)
  .get("/:id",   ctrl.getDocument)
  .patch("/:id", ctrl.updateDocument)
  .delete("/:id",ctrl.archiveDocument);

export default router;
