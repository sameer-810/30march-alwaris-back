import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { vendorTypeController } from "./vendor-type.controller.js";
import {
  vendorTypeCreateSchema,
  vendorTypeUpdateSchema,
  vendorTypeGetSchema,
  vendorTypeDeleteSchema,
  vendorTypeListSchema,
} from "./vendor-type.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(vendorTypeListSchema),
  vendorTypeController.list,
);
router.post(
  "/",
  validateRequest(vendorTypeCreateSchema),
  vendorTypeController.create,
);
router.get(
  "/:id",
  validateRequest(vendorTypeGetSchema),
  vendorTypeController.get,
);
router.patch(
  "/:id",
  validateRequest(vendorTypeUpdateSchema),
  vendorTypeController.update,
);
router.delete(
  "/:id",
  validateRequest(vendorTypeDeleteSchema),
  vendorTypeController.remove,
);

export default router;
