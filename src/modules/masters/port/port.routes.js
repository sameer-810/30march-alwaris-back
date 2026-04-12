import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { portController } from "./port.controller.js";
import {
  portCreateSchema,
  portUpdateSchema,
  portGetSchema,
  portDeleteSchema,
  portListSchema,
} from "./port.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(portListSchema), portController.list);
router.post("/", validateRequest(portCreateSchema), portController.create);
router.get("/:id", validateRequest(portGetSchema), portController.get);
router.patch("/:id", validateRequest(portUpdateSchema), portController.update);
router.delete("/:id", validateRequest(portDeleteSchema), portController.remove);

export default router;
