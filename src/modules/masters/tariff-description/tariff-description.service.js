import { tariffDescriptionRepository } from "./tariff-description.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const tariffDescriptionService = createResourceService({
  repository: tariffDescriptionRepository,
  notFoundMessage: "Tariff description not found",
  createMethod: "createWithAutoCounter",
  mapCreatePayload: (payload) => ({
    description: payload.description,
  }),
});

export { tariffDescriptionService };
