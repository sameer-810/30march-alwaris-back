import express from "express";
import { validateRequest } from "../../../middlewares/validateRequest.js";
import { authenticate } from "../../../middlewares/auth.js";
import { authorizeRoles } from "../../../middlewares/role.middleware.js";
import { shipmentController } from "./shipment.controller.js";
import {
  shipmentCreateSchema,
  shipmentUpdateSchema,
  shipmentGetSchema,
  shipmentDeleteSchema,
  shipmentListSchema,
} from "./shipment.validation.js";

const router = express.Router();

router.use(authenticate, authorizeRoles("Admin", "Operator"));

router.get("/", validateRequest(shipmentListSchema), shipmentController.list);
router.post(
  "/",
  validateRequest(shipmentCreateSchema),
  shipmentController.create,
);
router.get("/:id", validateRequest(shipmentGetSchema), shipmentController.get);
router.patch(
  "/:id",
  validateRequest(shipmentUpdateSchema),
  shipmentController.update,
);
router.delete(
  "/:id",
  validateRequest(shipmentDeleteSchema),
  shipmentController.remove,
);

export default router;
