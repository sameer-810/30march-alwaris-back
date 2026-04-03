const { tariffDescriptionService } = require("./tariff-description.service");
const { toTariffDescriptionDto } = require("./tariff-description.dto");
const { createMasterController } = require("../shared/createMasterController");

const tariffDescriptionController = createMasterController({
  service: tariffDescriptionService,
  toDto: toTariffDescriptionDto,
});

module.exports = { tariffDescriptionController };
