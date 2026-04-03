const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { vesselController } = require("./vessel.controller");
const {
  vesselCreateSchema,
  vesselUpdateSchema,
  vesselGetSchema,
  vesselDeleteSchema,
  vesselListSchema,
} = require("./vessel.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(vesselListSchema), vesselController.list);
router.post("/", validateRequest(vesselCreateSchema), vesselController.create);
router.get("/:id", validateRequest(vesselGetSchema), vesselController.get);
router.patch(
  "/:id",
  validateRequest(vesselUpdateSchema),
  vesselController.update,
);
router.delete(
  "/:id",
  validateRequest(vesselDeleteSchema),
  vesselController.remove,
);

module.exports = router;
