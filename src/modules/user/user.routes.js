import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import {
  userCreateSchema,
  userUpdateSchema,
  userPasswordResetSchema,
  userDeleteSchema,
  userListSchema,
} from "./user.validation.js";
import { userController } from "./user.controller.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin"));

router.get("/", validateRequest(userListSchema), userController.list);
router.post("/", validateRequest(userCreateSchema), userController.create);
router.patch("/:id", validateRequest(userUpdateSchema), userController.update);
router.post(
  "/:id/reset-password",
  validateRequest(userPasswordResetSchema),
  userController.resetPassword,
);
router.delete("/:id", validateRequest(userDeleteSchema), userController.remove);

export default router;
