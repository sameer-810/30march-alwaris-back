import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { tariffDescriptionController } from "./tariff-description.controller.js";
import {
  tariffDescriptionCreateSchema,
  tariffDescriptionUpdateSchema,
  tariffDescriptionGetSchema,
  tariffDescriptionDeleteSchema,
  tariffDescriptionListSchema,
} from "./tariff-description.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(tariffDescriptionListSchema),
  tariffDescriptionController.list,
);
router.post(
  "/",
  validateRequest(tariffDescriptionCreateSchema),
  tariffDescriptionController.create,
);
router.get(
  "/:id",
  validateRequest(tariffDescriptionGetSchema),
  tariffDescriptionController.get,
);
router.patch(
  "/:id",
  validateRequest(tariffDescriptionUpdateSchema),
  tariffDescriptionController.update,
);
router.delete(
  "/:id",
  validateRequest(tariffDescriptionDeleteSchema),
  tariffDescriptionController.remove,
);

export default router;
