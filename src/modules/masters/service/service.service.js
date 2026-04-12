import { serviceRepository } from "./service.repository.js";
import { createResourceService } from "../../common/shared-crud/createResourceService.js";

const serviceService = createResourceService({
  repository: serviceRepository,
  notFoundMessage: "Service not found",
  createMethod: "createWithAutoCode",
  mapCreatePayload: (payload) => ({
    serviceType: payload.serviceType,
  }),
});

export { serviceService };
