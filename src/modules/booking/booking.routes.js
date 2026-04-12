import express from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { authenticate } from "../../middlewares/auth.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { bookingController } from "./booking.controller.js";
import {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingGetSchema,
  bookingDeleteSchema,
  bookingListSchema,
  bookingNextReferenceSchema,
} from "./booking.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(bookingListSchema), bookingController.list);
router.get(
  "/next-reference",
  validateRequest(bookingNextReferenceSchema),
  bookingController.nextReference,
);
router.post(
  "/",
  validateRequest(bookingCreateSchema),
  bookingController.create,
);
router.get("/:id", validateRequest(bookingGetSchema), bookingController.get);
router.patch(
  "/:id",
  validateRequest(bookingUpdateSchema),
  bookingController.update,
);
router.delete(
  "/:id",
  validateRequest(bookingDeleteSchema),
  bookingController.remove,
);

export default router;
