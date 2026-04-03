const { AppError } = require("../../../utils/AppError");
const { termsConditionRepository } = require("./terms-condition.repository");
const { createMasterService } = require("../shared/createMasterService");

const termsConditionService = createMasterService({
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

module.exports = { termsConditionService };
