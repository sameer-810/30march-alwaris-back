const {
  tariffDescriptionRepository,
} = require("./tariff-description.repository");
const {
  createResourceService,
} = require("../../common/shared-crud/createResourceService");

const tariffDescriptionService = createResourceService({
  repository: tariffDescriptionRepository,
  notFoundMessage: "Tariff description not found",
  createMethod: "createWithAutoCounter",
  mapCreatePayload: (payload) => ({
    description: payload.description,
  }),
});

module.exports = { tariffDescriptionService };
