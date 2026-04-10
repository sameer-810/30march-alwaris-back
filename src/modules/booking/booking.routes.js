const express = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { authenticate } = require("../../middlewares/auth");
const { authorizeRoles } = require("../../middlewares/role.middleware");
const { bookingController } = require("./booking.controller");
const {
  bookingCreateSchema,
  bookingUpdateSchema,
  bookingGetSchema,
  bookingDeleteSchema,
  bookingListSchema,
  bookingNextReferenceSchema,
} = require("./booking.validation");

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

module.exports = router;
