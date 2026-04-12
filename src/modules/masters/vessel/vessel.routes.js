import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { vesselController } from "./vessel.controller.js";
import {
  vesselCreateSchema,
  vesselUpdateSchema,
  vesselGetSchema,
  vesselDeleteSchema,
  vesselListSchema,
} from "./vessel.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(vesselListSchema), vesselController.list);
router.post("/", validateRequest(vesselCreateSchema), vesselController.create);
router.get("/:id", validateRequest(vesselGetSchema), vesselController.get);
router.patch(
  "/:id",
  validateRequest(vesselUpdateSchema),
  vesselController.update,
);
router.delete(
  "/:id",
  validateRequest(vesselDeleteSchema),
  vesselController.remove,
);

export default router;
