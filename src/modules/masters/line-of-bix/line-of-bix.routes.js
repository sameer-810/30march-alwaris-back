import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { lineOfBixController } from "./line-of-bix.controller.js";
import {
  lineOfBixCreateSchema,
  lineOfBixUpdateSchema,
  lineOfBixGetSchema,
  lineOfBixDeleteSchema,
  lineOfBixListSchema,
} from "./line-of-bix.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(lineOfBixListSchema), lineOfBixController.list);
router.post(
  "/",
  validateRequest(lineOfBixCreateSchema),
  lineOfBixController.create,
);
router.get(
  "/:id",
  validateRequest(lineOfBixGetSchema),
  lineOfBixController.get,
);
router.patch(
  "/:id",
  validateRequest(lineOfBixUpdateSchema),
  lineOfBixController.update,
);
router.delete(
  "/:id",
  validateRequest(lineOfBixDeleteSchema),
  lineOfBixController.remove,
);

export default router;
