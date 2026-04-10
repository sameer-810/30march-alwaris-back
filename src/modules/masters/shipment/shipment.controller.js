const { shipmentService } = require("./shipment.service");
const { toShipmentDto } = require("./shipment.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const shipmentController = createResourceController({
  service: shipmentService,
  toDto: toShipmentDto,
});

module.exports = { shipmentController };
