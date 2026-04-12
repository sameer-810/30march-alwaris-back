import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { vendorAgentController } from "./vendor-agent.controller.js";
import {
  vendorAgentCreateSchema,
  vendorAgentUpdateSchema,
  vendorAgentGetSchema,
  vendorAgentDeleteSchema,
  vendorAgentListSchema,
} from "./vendor-agent.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(vendorAgentListSchema),
  vendorAgentController.list,
);
router.post(
  "/",
  validateRequest(vendorAgentCreateSchema),
  vendorAgentController.create,
);
router.get(
  "/:id",
  validateRequest(vendorAgentGetSchema),
  vendorAgentController.get,
);
router.patch(
  "/:id",
  validateRequest(vendorAgentUpdateSchema),
  vendorAgentController.update,
);
router.delete(
  "/:id",
  validateRequest(vendorAgentDeleteSchema),
  vendorAgentController.remove,
);

export default router;
