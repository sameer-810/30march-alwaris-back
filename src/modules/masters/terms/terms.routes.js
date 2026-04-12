import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { termsController } from "./terms.controller.js";
import {
  termsCreateSchema,
  termsUpdateSchema,
  termsGetSchema,
  termsDeleteSchema,
  termsListSchema,
} from "./terms.validation.js";

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

export default router;
