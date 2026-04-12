import { vesselRepository } from "./vessel.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const vesselService = createResourceService({
  repository: vesselRepository,
  notFoundMessage: "Vessel not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    vesselName: payload.vesselName,
  }),
});

export { vesselService };
