const { shipmentService } = require("./shipment.service");
const { toShipmentDto } = require("./shipment.dto");
const { createMasterController } = require("../shared/createMasterController");

const shipmentController = createMasterController({
  service: shipmentService,
  toDto: toShipmentDto,
});

module.exports = { shipmentController };
