const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { portController } = require("./port.controller");
const {
  portCreateSchema,
  portUpdateSchema,
  portGetSchema,
  portDeleteSchema,
  portListSchema,
} = require("./port.validation");

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(portListSchema), portController.list);
router.post("/", validateRequest(portCreateSchema), portController.create);
router.get("/:id", validateRequest(portGetSchema), portController.get);
router.patch("/:id", validateRequest(portUpdateSchema), portController.update);
router.delete("/:id", validateRequest(portDeleteSchema), portController.remove);

module.exports = router;
