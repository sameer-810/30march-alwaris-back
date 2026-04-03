const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { customerController } = require("./customer.controller");
const {
  customerCreateSchema,
  customerUpdateSchema,
  customerGetSchema,
  customerDeleteSchema,
  customerListSchema,
} = require("./customer.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(customerListSchema), customerController.list);
router.post(
  "/",
  validateRequest(customerCreateSchema),
  customerController.create,
);
router.get("/:id", validateRequest(customerGetSchema), customerController.get);
router.patch(
  "/:id",
  validateRequest(customerUpdateSchema),
  customerController.update,
);
router.delete(
  "/:id",
  validateRequest(customerDeleteSchema),
  customerController.remove,
);

module.exports = router;
