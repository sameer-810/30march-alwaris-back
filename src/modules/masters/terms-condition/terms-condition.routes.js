const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { termsConditionController } = require("./terms-condition.controller");
const {
  termsConditionCreateSchema,
  termsConditionUpdateSchema,
  termsConditionGetSchema,
  termsConditionDeleteSchema,
  termsConditionListSchema,
} = require("./terms-condition.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(termsConditionListSchema),
  termsConditionController.list,
);
router.post(
  "/",
  validateRequest(termsConditionCreateSchema),
  termsConditionController.create,
);
router.get(
  "/:id",
  validateRequest(termsConditionGetSchema),
  termsConditionController.get,
);
router.patch(
  "/:id",
  validateRequest(termsConditionUpdateSchema),
  termsConditionController.update,
);
router.delete(
  "/:id",
  validateRequest(termsConditionDeleteSchema),
  termsConditionController.remove,
);

module.exports = router;
