import { portService } from "./port.service.js";
import { toPortDto } from "./port.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const portController = createResourceController({
  service: portService,
  toDto: toPortDto,
});

export { portController };
