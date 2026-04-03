const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { lineOfBixController } = require("./line-of-bix.controller");
const {
  lineOfBixCreateSchema,
  lineOfBixUpdateSchema,
  lineOfBixGetSchema,
  lineOfBixDeleteSchema,
  lineOfBixListSchema,
} = require("./line-of-bix.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(lineOfBixListSchema), lineOfBixController.list);
router.post(
  "/",
  validateRequest(lineOfBixCreateSchema),
  lineOfBixController.create,
);
router.get(
  "/:id",
  validateRequest(lineOfBixGetSchema),
  lineOfBixController.get,
);
router.patch(
  "/:id",
  validateRequest(lineOfBixUpdateSchema),
  lineOfBixController.update,
);
router.delete(
  "/:id",
  validateRequest(lineOfBixDeleteSchema),
  lineOfBixController.remove,
);

module.exports = router;
