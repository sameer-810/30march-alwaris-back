const {
  tariffDescriptionRepository,
} = require("./tariff-description.repository");
const { createMasterService } = require("../shared/createMasterService");

const tariffDescriptionService = createMasterService({
  repository: tariffDescriptionRepository,
  notFoundMessage: "Tariff description not found",
  createMethod: "createWithAutoCounter",
  mapCreatePayload: (payload) => ({
    description: payload.description,
  }),
});

module.exports = { tariffDescriptionService };
