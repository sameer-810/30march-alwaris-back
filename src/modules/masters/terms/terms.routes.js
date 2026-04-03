const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { termsController } = require("./terms.controller");
const {
  termsCreateSchema,
  termsUpdateSchema,
  termsGetSchema,
  termsDeleteSchema,
  termsListSchema,
} = require("./terms.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(termsListSchema), termsController.list);
router.post("/", validateRequest(termsCreateSchema), termsController.create);
router.get("/:id", validateRequest(termsGetSchema), termsController.get);
router.patch(
  "/:id",
  validateRequest(termsUpdateSchema),
  termsController.update,
);
router.delete(
  "/:id",
  validateRequest(termsDeleteSchema),
  termsController.remove,
);

module.exports = router;
