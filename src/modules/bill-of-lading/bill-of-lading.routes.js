const express = require("express");
const { authenticate } = require("../../middlewares/auth");
const { authorizeRoles } = require("../../middlewares/role.middleware");
const { validateRequest } = require("../../middlewares/validateRequest");
const { billOfLadingController } = require("./bill-of-lading.controller");
const {
  billOfLadingCreateSchema,
  billOfLadingUpdateSchema,
  billOfLadingGetSchema,
  billOfLadingDeleteSchema,
  billOfLadingListSchema,
  billOfLadingNextNumberSchema,
  billOfLadingJobOptionsSchema,
} = require("./bill-of-lading.validation");

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

module.exports = router;
