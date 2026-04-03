const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { vendorAgentController } = require("./vendor-agent.controller");
const {
  vendorAgentCreateSchema,
  vendorAgentUpdateSchema,
  vendorAgentGetSchema,
  vendorAgentDeleteSchema,
  vendorAgentListSchema,
} = require("./vendor-agent.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get(
  "/",
  validateRequest(vendorAgentListSchema),
  vendorAgentController.list,
);
router.post(
  "/",
  validateRequest(vendorAgentCreateSchema),
  vendorAgentController.create,
);
router.get(
  "/:id",
  validateRequest(vendorAgentGetSchema),
  vendorAgentController.get,
);
router.patch(
  "/:id",
  validateRequest(vendorAgentUpdateSchema),
  vendorAgentController.update,
);
router.delete(
  "/:id",
  validateRequest(vendorAgentDeleteSchema),
  vendorAgentController.remove,
);

module.exports = router;
