const { portService } = require("./port.service");
const { toPortDto } = require("./port.dto");
const { createMasterController } = require("../shared/createMasterController");

const portController = createMasterController({
  service: portService,
  toDto: toPortDto,
});

module.exports = { portController };
