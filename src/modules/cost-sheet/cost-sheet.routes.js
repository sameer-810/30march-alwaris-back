import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { costSheetController } from "./cost-sheet.controller.js";
import {
  costSheetCreateSchema,
  costSheetUpdateSchema,
  costSheetGetSchema,
  costSheetDeleteSchema,
  costSheetListSchema,
  costSheetJobOptionsSchema,
  costSheetBookingDetailsSchema,
} from "./cost-sheet.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/job-options",
  validateRequest(costSheetJobOptionsSchema),
  costSheetController.jobOptions,
);
router.get(
  "/booking/:jobNo",
  validateRequest(costSheetBookingDetailsSchema),
  costSheetController.bookingDetails,
);
router.get("/", validateRequest(costSheetListSchema), costSheetController.list);
router.post(
  "/",
  validateRequest(costSheetCreateSchema),
  costSheetController.create,
);
router.get(
  "/:id",
  validateRequest(costSheetGetSchema),
  costSheetController.get,
);
router.patch(
  "/:id",
  validateRequest(costSheetUpdateSchema),
  costSheetController.update,
);
router.delete(
  "/:id",
  validateRequest(costSheetDeleteSchema),
  costSheetController.remove,
);

export default router;
