const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { vendorTypeController } = require("./vendor-type.controller");
const {
  vendorTypeCreateSchema,
  vendorTypeUpdateSchema,
  vendorTypeGetSchema,
  vendorTypeDeleteSchema,
  vendorTypeListSchema,
} = require("./vendor-type.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(vendorTypeListSchema),
  vendorTypeController.list,
);
router.post(
  "/",
  validateRequest(vendorTypeCreateSchema),
  vendorTypeController.create,
);
router.get(
  "/:id",
  validateRequest(vendorTypeGetSchema),
  vendorTypeController.get,
);
router.patch(
  "/:id",
  validateRequest(vendorTypeUpdateSchema),
  vendorTypeController.update,
);
router.delete(
  "/:id",
  validateRequest(vendorTypeDeleteSchema),
  vendorTypeController.remove,
);

module.exports = router;
