import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { billOfLadingController } from "./bill-of-lading.controller.js";
import {
  billOfLadingCreateSchema,
  billOfLadingUpdateSchema,
  billOfLadingGetSchema,
  billOfLadingDeleteSchema,
  billOfLadingListSchema,
  billOfLadingNextNumberSchema,
  billOfLadingJobOptionsSchema,
} from "./bill-of-lading.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(billOfLadingListSchema),
  billOfLadingController.list,
);
router.get(
  "/next-bl-number",
  validateRequest(billOfLadingNextNumberSchema),
  billOfLadingController.nextBlNumber,
);
router.get(
  "/job-options",
  validateRequest(billOfLadingJobOptionsSchema),
  billOfLadingController.jobOptions,
);
router.post(
  "/",
  validateRequest(billOfLadingCreateSchema),
  billOfLadingController.create,
);
router.get(
  "/:id",
  validateRequest(billOfLadingGetSchema),
  billOfLadingController.get,
);
router.patch(
  "/:id",
  validateRequest(billOfLadingUpdateSchema),
  billOfLadingController.update,
);
router.delete(
  "/:id",
  validateRequest(billOfLadingDeleteSchema),
  billOfLadingController.remove,
);

export default router;
