const { portService } = require("./port.service");
const { toPortDto } = require("./port.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const portController = createResourceController({
  service: portService,
  toDto: toPortDto,
});

module.exports = { portController };
