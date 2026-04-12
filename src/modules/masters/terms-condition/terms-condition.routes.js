import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { termsConditionController } from "./terms-condition.controller.js";
import {
  termsConditionCreateSchema,
  termsConditionUpdateSchema,
  termsConditionGetSchema,
  termsConditionDeleteSchema,
  termsConditionListSchema,
} from "./terms-condition.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(termsConditionListSchema),
  termsConditionController.list,
);
router.post(
  "/",
  validateRequest(termsConditionCreateSchema),
  termsConditionController.create,
);
router.get(
  "/:id",
  validateRequest(termsConditionGetSchema),
  termsConditionController.get,
);
router.patch(
  "/:id",
  validateRequest(termsConditionUpdateSchema),
  termsConditionController.update,
);
router.delete(
  "/:id",
  validateRequest(termsConditionDeleteSchema),
  termsConditionController.remove,
);

export default router;
