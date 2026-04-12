import { lineOfBixService } from "./line-of-bix.service.js";
import { toLineOfBixDto } from "./line-of-bix.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const lineOfBixController = createResourceController({
  service: lineOfBixService,
  toDto: toLineOfBixDto,
});

export { lineOfBixController };
