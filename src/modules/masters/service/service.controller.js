import { serviceService } from "./service.service.js";
import { toServiceDto } from "./service.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const serviceController = createResourceController({
  service: serviceService,
  toDto: toServiceDto,
});

export { serviceController };
