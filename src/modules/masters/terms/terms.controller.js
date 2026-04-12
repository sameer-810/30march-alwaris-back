import { termsService } from "./terms.service.js";
import { toTermsDto } from "./terms.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const termsController = createResourceController({
  service: termsService,
  toDto: toTermsDto,
});

export { termsController };
