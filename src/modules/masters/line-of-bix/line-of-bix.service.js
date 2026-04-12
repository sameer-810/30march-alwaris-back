import { lineOfBixRepository } from "./line-of-bix.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const lineOfBixService = createResourceService({
  repository: lineOfBixRepository,
  notFoundMessage: "Line Of BIX not found",
  createMethod: "createWithAutoCounter",
  mapCreatePayload: (payload) => ({
    code: payload.code,
    lineOfBix: payload.lineOfBix,
  }),
});

export { lineOfBixService };
