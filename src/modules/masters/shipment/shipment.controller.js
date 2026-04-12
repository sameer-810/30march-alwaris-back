import { shipmentService } from "./shipment.service.js";
import { toShipmentDto } from "./shipment.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const shipmentController = createResourceController({
  service: shipmentService,
  toDto: toShipmentDto,
});

export { shipmentController };
