const { shipmentRepository } = require("./shipment.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const shipmentService = createResourceService({
  repository: shipmentRepository,
  notFoundMessage: "Shipment not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    shipmentType: payload.shipmentType,
  }),
});

module.exports = { shipmentService };
