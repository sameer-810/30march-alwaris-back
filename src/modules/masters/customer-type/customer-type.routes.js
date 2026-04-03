const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { customerTypeController } = require("./customer-type.controller");
const {
  customerTypeCreateSchema,
  customerTypeUpdateSchema,
  customerTypeGetSchema,
  customerTypeDeleteSchema,
  customerTypeListSchema,
} = require("./customer-type.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(customerTypeListSchema),
  customerTypeController.list,
);
router.post(
  "/",
  validateRequest(customerTypeCreateSchema),
  customerTypeController.create,
);
router.get(
  "/:id",
  validateRequest(customerTypeGetSchema),
  customerTypeController.get,
);
router.patch(
  "/:id",
  validateRequest(customerTypeUpdateSchema),
  customerTypeController.update,
);
router.delete(
  "/:id",
  validateRequest(customerTypeDeleteSchema),
  customerTypeController.remove,
);

module.exports = router;
