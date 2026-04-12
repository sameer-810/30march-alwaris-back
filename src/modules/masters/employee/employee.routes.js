import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { employeeController } from "./employee.controller.js";
import {
  employeeCreateSchema,
  employeeUpdateSchema,
  employeeGetSchema,
  employeeDeleteSchema,
  employeeListSchema,
} from "./employee.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(employeeListSchema), employeeController.list);
router.post(
  "/",
  validateRequest(employeeCreateSchema),
  employeeController.create,
);
router.get("/:id", validateRequest(employeeGetSchema), employeeController.get);
router.patch(
  "/:id",
  validateRequest(employeeUpdateSchema),
  employeeController.update,
);
router.delete(
  "/:id",
  validateRequest(employeeDeleteSchema),
  employeeController.remove,
);

export default router;
