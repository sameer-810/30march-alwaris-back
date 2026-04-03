const { shipmentRepository } = require("./shipment.repository");
const { createMasterService } = require("../shared/createMasterService");

const shipmentService = createMasterService({
  repository: shipmentRepository,
  notFoundMessage: "Shipment not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    shipmentType: payload.shipmentType,
  }),
});

module.exports = { shipmentService };
