import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { customerTypeController } from "./customer-type.controller.js";
import {
  customerTypeCreateSchema,
  customerTypeUpdateSchema,
  customerTypeGetSchema,
  customerTypeDeleteSchema,
  customerTypeListSchema,
} from "./customer-type.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(customerTypeListSchema),
  customerTypeController.list,
);
router.post(
  "/",
  validateRequest(customerTypeCreateSchema),
  customerTypeController.create,
);
router.get(
  "/:id",
  validateRequest(customerTypeGetSchema),
  customerTypeController.get,
);
router.patch(
  "/:id",
  validateRequest(customerTypeUpdateSchema),
  customerTypeController.update,
);
router.delete(
  "/:id",
  validateRequest(customerTypeDeleteSchema),
  customerTypeController.remove,
);

export default router;
