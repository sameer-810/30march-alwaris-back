import { termsRepository } from "./terms.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const termsService = createResourceService({
  repository: termsRepository,
  notFoundMessage: "Terms not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    terms: payload.terms,
    description: payload.description,
  }),
});

export { termsService };
