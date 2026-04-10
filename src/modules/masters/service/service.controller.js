const { serviceService } = require("./service.service");
const { toServiceDto } = require("./service.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const serviceController = createResourceController({
  service: serviceService,
  toDto: toServiceDto,
});

module.exports = { serviceController };
