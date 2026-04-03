const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { serviceController } = require("./service.controller");
const {
  serviceCreateSchema,
  serviceUpdateSchema,
  serviceGetSchema,
  serviceDeleteSchema,
  serviceListSchema,
} = require("./service.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(serviceListSchema), serviceController.list);
router.post(
  "/",
  validateRequest(serviceCreateSchema),
  serviceController.create,
);
router.get("/:id", validateRequest(serviceGetSchema), serviceController.get);
router.patch(
  "/:id",
  validateRequest(serviceUpdateSchema),
  serviceController.update,
);
router.delete(
  "/:id",
  validateRequest(serviceDeleteSchema),
  serviceController.remove,
);

module.exports = router;
