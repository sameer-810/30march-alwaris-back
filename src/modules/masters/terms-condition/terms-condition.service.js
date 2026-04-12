import { AppError } from "../../../utils/AppError.js";
import { termsConditionRepository } from "./terms-condition.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const termsConditionService = createResourceService({
  repository: termsConditionRepository,
  notFoundMessage: "Terms & Condition not found",
  createMethod: "createWithAutoCounter",
  beforeCreate: async (payload) => {
    const exists = await termsConditionRepository.lineOfBixExists(
      payload.lineOfBixId,
    );
    if (!exists) throw new AppError("Line Of BIX not found", 404);
  },
  mapCreatePayload: (payload) => ({
    lineOfBixId: payload.lineOfBixId,
    description: payload.description,
  }),
  beforeUpdate: async (patch) => {
    if (!patch.lineOfBixId) return;

    const exists = await termsConditionRepository.lineOfBixExists(
      patch.lineOfBixId,
    );
    if (!exists) throw new AppError("Line Of BIX not found", 404);
  },
});

export { termsConditionService };
