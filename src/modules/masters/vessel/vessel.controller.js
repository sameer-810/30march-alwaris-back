const { vesselService } = require("./vessel.service");
const { toVesselDto } = require("./vessel.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const vesselController = createResourceController({
  service: vesselService,
  toDto: toVesselDto,
});

module.exports = { vesselController };
