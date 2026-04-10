const { tariffDescriptionService } = require("./tariff-description.service");
const { toTariffDescriptionDto } = require("./tariff-description.dto");
const {
  createResourceController,
} = require("../../common/shared-crud/createResourceController");

const tariffDescriptionController = createResourceController({
  service: tariffDescriptionService,
  toDto: toTariffDescriptionDto,
});

module.exports = { tariffDescriptionController };
