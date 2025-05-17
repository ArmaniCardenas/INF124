import { Router } from "express";
import userVerification from "../../infrastructure/middleware/AuthMiddleware";
import * as ctrl from "../../infrastructure/controllers/profileController";

const router = Router();

router.use(userVerification);

router
  .patch('/newUsername', ctrl.changeUsername)
  .patch('/newPassword', ctrl.changePassword)
  .patch('/newEmail', ctrl.changeEmail);


export default router;
