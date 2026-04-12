import { tariffDescriptionService } from "./tariff-description.service.js";
import { toTariffDescriptionDto } from "./tariff-description.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const tariffDescriptionController = createResourceController({
  service: tariffDescriptionService,
  toDto: toTariffDescriptionDto,
});

export { tariffDescriptionController };
