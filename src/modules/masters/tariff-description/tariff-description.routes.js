const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const {
  tariffDescriptionController,
} = require("./tariff-description.controller");
const {
  tariffDescriptionCreateSchema,
  tariffDescriptionUpdateSchema,
  tariffDescriptionGetSchema,
  tariffDescriptionDeleteSchema,
  tariffDescriptionListSchema,
} = require("./tariff-description.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(tariffDescriptionListSchema),
  tariffDescriptionController.list,
);
router.post(
  "/",
  validateRequest(tariffDescriptionCreateSchema),
  tariffDescriptionController.create,
);
router.get(
  "/:id",
  validateRequest(tariffDescriptionGetSchema),
  tariffDescriptionController.get,
);
router.patch(
  "/:id",
  validateRequest(tariffDescriptionUpdateSchema),
  tariffDescriptionController.update,
);
router.delete(
  "/:id",
  validateRequest(tariffDescriptionDeleteSchema),
  tariffDescriptionController.remove,
);

module.exports = router;
