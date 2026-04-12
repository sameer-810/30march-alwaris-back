import { termsConditionService } from "./terms-condition.service.js";
import { toTermsConditionDto } from "./terms-condition.dto.js";
import { createResourceController } from "../../common/shared-crud/createResourceController.js";

const termsConditionController = createResourceController({
  service: termsConditionService,
  toDto: toTermsConditionDto,
});

export { termsConditionController };
