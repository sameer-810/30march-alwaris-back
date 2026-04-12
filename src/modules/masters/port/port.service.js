import { portRepository } from "./port.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const portService = createResourceService({
  repository: portRepository,
  notFoundMessage: "Port not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    portCode: payload.portCode,
    portName: payload.portName,
  }),
});

export { portService };
