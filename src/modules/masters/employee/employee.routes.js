const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { employeeController } = require("./employee.controller");
const {
  employeeCreateSchema,
  employeeUpdateSchema,
  employeeGetSchema,
  employeeDeleteSchema,
  employeeListSchema,
} = require("./employee.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(employeeListSchema), employeeController.list);
router.post(
  "/",
  validateRequest(employeeCreateSchema),
  employeeController.create,
);
router.get("/:id", validateRequest(employeeGetSchema), employeeController.get);
router.patch(
  "/:id",
  validateRequest(employeeUpdateSchema),
  employeeController.update,
);
router.delete(
  "/:id",
  validateRequest(employeeDeleteSchema),
  employeeController.remove,
);

module.exports = router;
