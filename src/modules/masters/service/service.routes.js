import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { serviceController } from "./service.controller.js";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceGetSchema,
  serviceDeleteSchema,
  serviceListSchema,
} from "./service.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(serviceListSchema), serviceController.list);
router.post(
  "/",
  validateRequest(serviceCreateSchema),
  serviceController.create,
);
router.get("/:id", validateRequest(serviceGetSchema), serviceController.get);
router.patch(
  "/:id",
  validateRequest(serviceUpdateSchema),
  serviceController.update,
);
router.delete(
  "/:id",
  validateRequest(serviceDeleteSchema),
  serviceController.remove,
);

export default router;
