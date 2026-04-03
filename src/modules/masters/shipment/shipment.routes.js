const express = require("express");
const { validateRequest } = require("../../../middlewares/validateRequest");
const { authenticate } = require("../../../middlewares/auth");
const { authorizeRoles } = require("../../../middlewares/role.middleware");
const { shipmentController } = require("./shipment.controller");
const {
  shipmentCreateSchema,
  shipmentUpdateSchema,
  shipmentGetSchema,
  shipmentDeleteSchema,
  shipmentListSchema,
} = require("./shipment.validation");

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

module.exports = router;
