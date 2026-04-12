import { vesselService } from "./vessel.service.js";
import { toVesselDto } from "./vessel.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const vesselController = createResourceController({
  service: vesselService,
  toDto: toVesselDto,
});

export { vesselController };
