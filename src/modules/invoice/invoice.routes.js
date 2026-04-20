import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { invoiceController } from "./invoice.controller.js";
import {
  invoiceCreateSchema,
  invoiceUpdateSchema,
  invoiceGetSchema,
  invoiceDeleteSchema,
  invoiceListSchema,
  invoiceJobOptionsSchema,
  invoiceSearchSchema,
} from "./invoice.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/job-options",
  validateRequest(invoiceJobOptionsSchema),
  invoiceController.jobOptions,
);
router.get(
  "/search",
  validateRequest(invoiceSearchSchema),
  invoiceController.search,
);

router.get("/", validateRequest(invoiceListSchema), invoiceController.list);
router.post(
  "/",
  validateRequest(invoiceCreateSchema),
  invoiceController.create,
);
router.get("/:id", validateRequest(invoiceGetSchema), invoiceController.get);
router.patch(
  "/:id",
  validateRequest(invoiceUpdateSchema),
  invoiceController.update,
);
router.delete(
  "/:id",
  validateRequest(invoiceDeleteSchema),
  invoiceController.remove,
);

export default router;
