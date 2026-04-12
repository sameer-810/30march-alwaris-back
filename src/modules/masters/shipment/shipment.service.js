import { shipmentRepository } from "./shipment.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const shipmentService = createResourceService({
  repository: shipmentRepository,
  notFoundMessage: "Shipment not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    shipmentType: payload.shipmentType,
  }),
});

export { shipmentService };
