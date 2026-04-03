const express = require("express");
const { validateRequest } = require("../../middlewares/validateRequest");
const { authenticate } = require("../../middlewares/auth");
const { authorizeRoles } = require("../../middlewares/role.middleware");
const {
  userCreateSchema,
  userUpdateSchema,
  userPasswordResetSchema,
  userDeleteSchema,
  userListSchema,
} = require("./user.validation");
const { userController } = require("./user.controller");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin"));

router.get("/", validateRequest(userListSchema), userController.list);
router.post("/", validateRequest(userCreateSchema), userController.create);
router.patch("/:id", validateRequest(userUpdateSchema), userController.update);
router.post(
  "/:id/reset-password",
  validateRequest(userPasswordResetSchema),
  userController.resetPassword,
);
router.delete("/:id", validateRequest(userDeleteSchema), userController.remove);

module.exports = router;
