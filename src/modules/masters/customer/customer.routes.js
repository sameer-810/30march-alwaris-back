import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { customerController } from "./customer.controller.js";
import {
  customerCreateSchema,
  customerUpdateSchema,
  customerGetSchema,
  customerDeleteSchema,
  customerListSchema,
} from "./customer.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(customerListSchema), customerController.list);
router.post(
  "/",
  validateRequest(customerCreateSchema),
  customerController.create,
);
router.get("/:id", validateRequest(customerGetSchema), customerController.get);
router.patch(
  "/:id",
  validateRequest(customerUpdateSchema),
  customerController.update,
);
router.delete(
  "/:id",
  validateRequest(customerDeleteSchema),
  customerController.remove,
);

export default router;
