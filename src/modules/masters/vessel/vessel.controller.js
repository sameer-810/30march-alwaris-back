const { vesselService } = require("./vessel.service");
const { toVesselDto } = require("./vessel.dto");
const { createMasterController } = require("../shared/createMasterController");

const vesselController = createMasterController({
  service: vesselService,
  toDto: toVesselDto,
});

module.exports = { vesselController };
