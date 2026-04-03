const { serviceService } = require("./service.service");
const { toServiceDto } = require("./service.dto");
const { createMasterController } = require("../shared/createMasterController");

const serviceController = createMasterController({
  service: serviceService,
  toDto: toServiceDto,
});

module.exports = { serviceController };
